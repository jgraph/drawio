/**
 * Copyright (c) 2020-2025, JGraph Holdings Ltd
 * Copyright (c) 2020-2025, draw.io AG
 */
import fs from 'fs';
import sharp from 'sharp';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { imageSize } from 'image-size';

const argv = yargs(hideBin(process.argv)).options({
  file: { type: 'string', demandOption: true, describe: 'The path to the .drawio file' },
  percentage: { type: 'number', demandOption: false, describe: 'The percentage to resize the images to' },
  width: { type: 'number', demandOption: false, describe: 'The width to resize the images to' },
  out: { type: 'string', demandOption: false, describe: 'Output file path (default: overwrite the input file)' }
}).argv;

const resizeImage = async (base64Image, percentage, minWidth) =>
  {
    console.log(`Resizing image...`);
    const matches = base64Image.match(/^data:image\/(jpeg|png),(.*);$/);
    if (!matches) return null;
  
    const imageBuffer = Buffer.from(matches[2], 'base64');
    const dimensions = imageSize(imageBuffer);
  
    let targetWidth;
  
    if (percentage)
    {
      const calculatedWidth = Math.floor(dimensions.width * (percentage / 100));
      console.log(`Original width: ${dimensions.width}, Percentage resize: ${percentage}%, Calculated width: ${calculatedWidth}`);
  
      // Enforce minimum width if provided
      targetWidth = minWidth ? Math.max(calculatedWidth, minWidth) : calculatedWidth;
    }
    else if (minWidth)
    {
      targetWidth = minWidth;
      console.log(`Using minimum width directly: ${minWidth}`);
    }
    else
    {
      console.log(`No resizing parameters provided`);
      return null;
    }
  
    console.log(`Final target width: ${targetWidth}`);

    if (targetWidth >= dimensions.width)
    {
      // Re-encoding without shrinking would only degrade JPEGs, so leave
      // the original bytes untouched
      console.log(`Image width ${dimensions.width}px is already <= target, skipping`);
      return null;
    }

    return sharp(imageBuffer)
      .resize({ width: targetWidth, withoutEnlargement: true })
      .toBuffer()
      .then(resizedBuffer =>
      {
        console.log(`Image resized to width: ${targetWidth}px`);
        return `data:image/${matches[1]},` + resizedBuffer.toString('base64') + ';';
      });
  };

const processDrawioFile = async (filePath, percentage, width, outPath) =>
{
  console.log(`Starting processing of ${filePath}`);

  if (!(percentage || width))
  {
    console.log(`You must pass in one of percentage or width`);
    process.exitCode = 1;
    return;
  }

  try
  {
    let data = fs.readFileSync(filePath, { encoding: 'utf-8' });

    // Compressed files store each diagram as base64 deflate data, so there
    // are no data URIs to match and the file would be rewritten unchanged
    if (data.indexOf('<diagram') >= 0 && data.indexOf('<mxGraphModel') < 0)
    {
      console.error(`The diagram data in ${filePath} is compressed. Disable ` +
        `compression in draw.io (File > Properties > Compressed) and save the file again first.`);
      process.exitCode = 1;
      return;
    }

    // Adjust the regex pattern to expect ";" as the closing character of the base64 data
    const base64Pattern = /data:image\/(?:jpeg|png),[^;]+;/g;
    const images = [...data.matchAll(base64Pattern)].map(match => match[0]);

    console.log(`Found ${images.length} images to process.`);

    let resized = 0;
    let failed = 0;

    for (let i = 0; i < images.length; i++)
    {
      console.log(`Processing image ${i + 1} of ${images.length}...`);

      try
      {
        const newBase64 = await resizeImage(images[i], percentage, width);

        if (newBase64 && newBase64 !== images[i])
        {
          data = data.replace(images[i], newBase64);
          resized++;
        }
      }
      catch (error)
      {
        // A corrupt image must not abort the remaining images
        console.error(`Skipping image ${i + 1}: ${error.message}`);
        failed++;
      }
    }

    if (resized > 0 || outPath)
    {
      const target = outPath || filePath;
      // Write to a temp file and rename so an interrupted write cannot
      // truncate the target file
      const tempPath = target + '.tmp-' + process.pid;

      try
      {
        fs.writeFileSync(tempPath, data, { encoding: 'utf-8' });
        fs.renameSync(tempPath, target);
      }
      catch (error)
      {
        fs.rmSync(tempPath, { force: true });
        throw error;
      }

      console.log(`Resized ${resized} of ${images.length} images. Saved to ${target}`);
    }
    else
    {
      console.log(`No images were modified. File not written.`);
    }

    if (failed > 0)
    {
      console.log(`${failed} image(s) failed to process.`);
      process.exitCode = 1;
    }
  }
  catch (error)
  {
    console.error(`Error processing file: ${error.message}`);
    process.exitCode = 1;
  }
};

await processDrawioFile(argv.file, argv.percentage, argv.width, argv.out);

