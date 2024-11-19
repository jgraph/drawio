draw.io file sizing script

Takes any draw.io file or mx model as input and resizes embedded PNG and JPEG images according to passed in parameters.

Installing

Run 'npm install' in this folder. Ensure you have node locally.

Running

To resize all images to 200 width:

node drawImageResize.js --file=path/to/your/file.drawio --width=200

To resize all images to 40% their current width:

node drawImageResize.js --file=path/to/your/file.drawio --percentage=40