# LuxorFontFactory
A simple command-line interface to create Luxor 1/AR and 2 font files.

## Installation
This was made with Node.js v18.15.0 - older versions may work, but the latest LTS
release is recommended. <https://nodejs.org>

1. Clone the repository.
2. In the repository's directory, run `npm install --save-dev`
3. In the same directory, run `npm run build`
4. Finally, run `npm install -g`
5. After that you can now enter `LuxorFontFactory` in a command prompt to invoke
   the program.

## Usage
This is meant to be used with BMFont: <https://www.angelcode.com/products/bmfont/>

Usage: `LuxorFontFactory [options] <input-file> [output-file]`

Options:
- `-V, --version`:              output the version number
- `-b, --binary`:               Treat file as binary format
- `-2, --luxor2`:               Output a Luxor 2 font file instead of a Luxor 1/AR font file
- `-n, --filename <filename>`:  The filename to use; if not provided will detect from first page
- `-p, --png`:                  Use PNG instead of JPG+TGA (can be only used with `-2`)
- `-h, --help`:                 display help for command

This only converts BMFont to Luxor font file formats. You will need to edit the exported
image to be compatible with Luxor (JPG for RGB and TGA for alpha or optionally PNG for Luxor 2).