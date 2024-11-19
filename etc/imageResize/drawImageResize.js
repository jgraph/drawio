const fs = require('fs');
const sharp = require('sharp');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const sizeOf = require('image-size');

const argv = yargs(hideBin(process.argv)).options({
  file: { type: 'string', demandOption: true, describe: 'The path to the .drawio file' },
  percentage: { type: 'number', demandOption: false, describe: 'The percentage to resize the images to' },
  width: { type: 'number', demandOption: false, describe: 'The width to resize the images to' }
}).argv;

const resizeImage = async (base64Image, percentage, width) =>
{
  console.log(`Resizing image...`);
  // Adjust the regex to match the new end character ";" instead of ","
  const matches = base64Image.match(/^data:image\/(jpeg|png),(.*);$/);
  if (!matches) return null;

  const imageBuffer = Buffer.from(matches[2], 'base64');
  const dimensions = sizeOf(imageBuffer);
  
  console.log(`width = ${width}`);
  console.log(`percentage = ${percentage}`);

  if (percentage && !width)
  {
    // Width isn't passed in, use percentage
  	width = Math.floor(dimensions.width * (percentage / 100));
  	console.log(`dimensions.width = ${dimensions.width}`);
  }
  console.log(`width = ${width}`);
  return sharp(imageBuffer)
    .resize({ width: width, withoutEnlargement: true })
    .toBuffer()
    .then(resizedBuffer =>
    {
      console.log(`Image resized to ${percentage}% of its original size.`);
      // Ensure to append ";" at the end after re-encoding to base64
      return `data:image/${matches[1]},` + resizedBuffer.toString('base64') + ';';
    });
};

const processDrawioFile = async (filePath, percentage, width) =>
{
  console.log(`Starting processing of ${filePath}`);
  
  if (!(percentage || width))
  {
    console.log(`You must pass in one of percentage or width`);
    return;
  }

  try
  {
    let data = fs.readFileSync(filePath, { encoding: 'utf-8' });
    // Adjust the regex pattern to expect ";" as the closing character of the base64 data
    const base64Pattern = /data:image\/(?:jpeg|png),[^;]+;/g;
    const images = [...data.matchAll(base64Pattern)].map(match => match[0]);

    console.log(`Found ${images.length} images to process.`);

    for (let i = 0; i < images.length; i++)
    {
      console.log(`Processing image ${i + 1} of ${images.length}...`);
      const newBase64 = await resizeImage(images[i], percentage, width);

      if (newBase64)
      {
        data = data.replace(images[i], newBase64);
      }
    }

    fs.writeFileSync(filePath, data, { encoding: 'utf-8' });
    console.log(`All images processed. Updated file saved.`);
  }
  catch (error)
  {
    console.error(`Error processing file: ${error.message}`);
  }
};

processDrawioFile(argv.file, argv.percentage, argv.width);

