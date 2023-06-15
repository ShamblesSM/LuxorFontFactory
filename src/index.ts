#! /usr/bin/env node
'use strict';

import * as fs from 'fs';
import * as loadbm from 'load-bmfont';
import { exit } from 'process';
import { Command } from 'commander';
import * as hf from './helperFunctions';

// don't ask why I'm using typescript because vscode didn't load intellisense for this thing

const program = new Command();
program
    .name("LuxorFontFactory")
    .version('1.0.0')
    .description('Parses BMFont files for use with Luxor mods.')
    .addHelpText(
        'beforeAll',
        'Make sure you have checked "Equalize cell heights" so exported fonts don\'t look ugly!'
    )
    .argument('<input-file>')
    .argument('[output-file]')
    .option('-b, --binary', 'Treat file as binary format')
    .option(
        '-2, --luxor2',
        'Output a Luxor 2 font file instead of a Luxor 1/AR font file'
    )
    .option(
        '-n, --filename <filename>',
        'The filename to use; if not provided will detect from first page'
    )
    .option(
        '-p, --png',
        'Use PNG instead of JPG+TGA (can be only used with -2)'
    )
    .option(
        '-d --debug',
        'Print font info for debugging'
    )
    .parse();

const options = program.opts();

// catch some errors
if (!options.luxor2 && options.png) {
    console.log('Error: cannot use --png without --luxor2');
    exit(1);
}

// now we actually parse here
const infile: String = program.args[0];
const outfile: String = program.args[1]
    ? program.args[1]
    : program.args[0].replace(/\.fnt$/gim, '.font');

loadbm(
    {
        uri: infile,
        binary: options.binary,
    },
    (e: Error, f: any) => {
        if (e) throw e;

        //prettier-ignore
        const material: String = options.filename ? options.filename
            : f.pages[0].replace(/_[0-9]+?\.(tga|dds|png)$/gim, '');
        // we'll just manually add it again if it's luxor 2

        // now we check if every character has the exact same height
        // as it's lineHeight
        
        // actualHeight will be used for AR
        let actualHeight;

        if (options.debug) {
            console.log(f)
        }
        
        f.chars.forEach(char => {
            // f.info.padding = [ up, right, down, left ]
            let paddedHeight = (f.info.padding[0] + f.info.padding[2]) + (f.info.outline*2)
            actualHeight = f.common.lineHeight + paddedHeight
            if (char.height != actualHeight) {
                console.log(
                    `Error: Character "${String.fromCharCode(
                        char.id
                    )} has inequal line height (${
                        char.height
                    }) from common line height (${f.common.lineHeight}).\nMake sure "Equalize line heights" is checked.`
                );
                exit(1);
            }
        });

        if (options.luxor2) {
            let out = [];
            for (let i = 0; i < f.pages.length; i++) {
                out.push(
                    `Material_${i} = ${hf.getImagePath(
                        material,
                        options.png,
                        i
                    )}`
                );
                out.push('Anim Idle', '{');
                f.chars.forEach((char) => {
                    let x = char.x,
                        y = char.y,
                        w = char.width,
                        h = char.height,
                        tup1 = x / f.common.scaleW,
                        tup2 = y / f.common.scaleH,
                        tup3 = (x + w) / f.common.scaleW,
                        tup4 = (y + h) / f.common.scaleH;
                    out.push(
                        `   SubAnim Char ${hf.getCharacterString(char.id)}`,
                        `   {`,
                        `      Frame`,
                        `      {`,
                        `         Material = ${char.page}`,
                        `         Rect = [ ${tup1}, ${tup2}, ${tup3}, ${tup4} ]`,
                        `         Origin = [ 0, 0 ]`,
                        `      }`,
                        `   }`
                    );
                });
                out.push('}');
                let outstring = out.join('\n');

                fs.writeFile(`./${outfile}`, outstring, () => {
                    exit(0);
                });
            }
        } else {
            if (f.pages > 1) {
                // luxor 1/AR doesn't allow for multiple images so we bounce
                console.log(
                    'Error: Multiple pages are not supported in Luxor 1/AR.'
                );
                exit(1);
            }
            let out = [];
            out.push(
                `data/bitmaps/fonts/${material}.jpg`,
                `data/bitmaps/fonts/${material}_alpha.tga`,
                `${actualHeight}`,
                `1 ${f.chars.length}`
            );
            f.chars.forEach((char) => {
                out.push(
                    String.fromCharCode(char.id),
                    `${char.x} ${char.y} ${char.width}`
                );
            });
            out.push(''); // There's a newline at the end of the file
            let outstring = out.join('\r\n');

            fs.writeFile(`./${outfile}`, outstring, () => {
                exit(0);
            });
        }
    }
);
