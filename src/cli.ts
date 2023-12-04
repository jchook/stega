import sharp from "sharp";
import fs from "fs";
import { Command } from "commander";
import { embedDataInImage, extractDataFromImage } from "./steg";

const program = new Command();
program
  .name("steg")
  .version("0.0.1")
  .description("A command line tool for steganography");

program
  .command("embed")
  .description("Embed data in an image")
  .argument("<image>", "Path to an image to embed data in")
  .argument("<data>", "Path to a data file to embed")
  .option("-o, --output <output>", "Output file")
  .action(async (imagePath, dataPath, options) => {
    try {
      const metadata = await sharp(imagePath).metadata();
      const imageData = await sharp(imagePath)
        .raw()
        .toColourspace("rgba")
        .ensureAlpha()
        .toBuffer({ resolveWithObject: true });
      embedDataInImage(imageData.data, fs.readFileSync(dataPath));
      let finalImage = sharp(imageData.data, {
        raw: {
          width: imageData.info.width,
          height: imageData.info.height,
          channels: 4,
        },
      });

      if (!metadata.hasAlpha) {
        finalImage = finalImage.removeAlpha();
      }

      await finalImage.toFile(options.output || "output.png");
    } catch (err) {
      console.log("Error: " + err);
    }
  });

async function processImage(
  imagePath: string,
  dataPath: string,
  output: string
) {
  try {
    const originalImage = sharp(imagePath);
    const metadata = await originalImage.metadata();

    const hasAlpha = metadata.channels === 4;
    const imageWithAlpha = originalImage
      .ensureAlpha()
      .raw()
      .toColourspace("rgba");
    const imageData = await imageWithAlpha.toBuffer({
      resolveWithObject: true,
    });
    const dataBuffer = fs.readFileSync(dataPath);

    // Process imageData here

    let finalImage = sharp(imageData.data, {
      raw: {
        width: imageData.info.width,
        height: imageData.info.height,
        channels: 4,
      },
    });

    if (!hasAlpha) {
      finalImage = finalImage.removeAlpha();
    }

    await finalImage.toFile(output);
  } catch (err) {
    console.error("Error processing the image: ", err);
  }
}

// Usage
program
  .command("extract")
  .description("Extract data from an image")
  .argument("<image>", "Path to an image to extract data from")
  .option("-o, --output <output>", "Output file")
  .action(async (imagePath, options) => {
    try {
      const image = sharp(imagePath).raw().toColourspace("rgba");
      const imageData = await image.toBuffer({ resolveWithObject: true });
      const data = extractDataFromImage(imageData.data);
      fs.writeFileSync(options.output || "output.txt", data);
    } catch (err) {
      console.log("Error: " + err);
    }
  });

await program.parseAsync(process.argv);
