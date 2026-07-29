draw.io file sizing script

Takes any draw.io file or mx model as input and resizes embedded PNG and JPEG images according to passed in parameters.

Installing

Run 'npm install' in this folder. Ensure you have node locally.

Running

To resize all images to 200 width:

node drawImageResize.js --file=path/to/your/file.drawio --width=200

To resize all images to 40% their current width:

node drawImageResize.js --file=path/to/your/file.drawio --percentage=40

To resize all images to 40% of original size but no less than 300px:

node drawImageResize.js --file=path/to/your/file.drawio --percentage=40 --width=300

To write the result to a new file instead of overwriting the input:

node drawImageResize.js --file=path/to/your/file.drawio --percentage=40 --out=path/to/your/resized.drawio

Notes

- Without --out the input file is overwritten in place (the write is atomic, and the file is left untouched when no image changes).
- Images are never enlarged, and images already at or below the target width are left byte-identical.
- The file must be saved without compression (File > Properties > Compressed unchecked in draw.io); compressed files are rejected with an error.
- Images that fail to decode are skipped with a warning and the exit code is non-zero.