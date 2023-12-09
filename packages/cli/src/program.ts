import * as sharp from "sharp";
import * as fs from "fs";
import { Command } from "commander";
import { embedDataInImage, extractDataFromImage } from "@stegapng/core";
import { readStdinToBuffer } from "./stdio";

const useStdio = (x: string | undefined) => !x || x === "-";

export function createProgram() {
  const program = new Command();
  program
    .name("steg")
    .version("0.0.1")
    .description("A command line tool for steganography");

  program
    .command("embed")
    .alias("c")
    .description("Embed data in an image")
    .argument("<image>", "Path to an image to embed data in")
    .argument("[data]", "Path to a data file to embed")
    .option("-o, --output <output>", "Output file")
    .action(async (imagePath, dataPath, options) => {
      try {
        const metadata = await sharp(imagePath).metadata();
        const imageData = await sharp(imagePath)
          .raw()
          .toColourspace("rgba")
          .ensureAlpha()
          .toBuffer({ resolveWithObject: true });
        embedDataInImage(
          imageData.data,
          useStdio(dataPath)
            ? await readStdinToBuffer()
            : fs.readFileSync(dataPath)
        );
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

        if (options.output === "-") {
          finalImage.png().pipe(process.stdout);
        } else {
          const outputPath = options.output || "output.png";
          await finalImage.png().toFile(outputPath);
          process.stderr.write(`Output to ${outputPath}\n`);
        }
      } catch (err) {
        console.log("Error: " + err);
      }
    });

  // Usage
  program
    .command("extract")
    .alias("x")
    .description("Extract data from an image")
    .argument("<image>", "Path to an image to extract data from")
    .option("-o, --output <output>", "Output file")
    .action(async (imagePath, options) => {
      try {
        const imageData = await sharp(imagePath)
          .raw()
          .toColourspace("rgba")
          .ensureAlpha()
          .toBuffer({ resolveWithObject: true });
        const data = extractDataFromImage(imageData.data);
        if (options.output === "-" || !options.output) {
          process.stdout.write(data);
        } else {
          process.stderr.write(`Output to ${options.output}\n`);
          fs.writeFileSync(options.output, data);
        }
      } catch (err) {
        console.log("Error: " + err);
      }
    });

  return program;
}
