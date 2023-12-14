import sharp from "sharp";
import fs from "fs";
import { Command } from "commander";
import { embedDataInImage, extractDataFromImage } from "@stegapng/core";
import { readStdinToBuffer } from "./stdio";

const useStdin = (x: string | undefined) => !x || x === "-";
const useStdout = (x: string | undefined) =>
  (!x && !process.stdout.isTTY) || x === "-";

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
          useStdin(dataPath)
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

        if (useStdout(options.output)) {
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

  program
    .command("genpng")
    .description("Generate a PNG file")
    .argument("[width]", "Width of the image", "256")
    .argument("[height]", "Height of the image", "256")
    .option("-o, --output <output>", "Output file")
    .action(async (widthStr, heightStr, options) => {
      try {
        const width = parseInt(widthStr);
        const height = parseInt(heightStr);
        const imageData = await sharp({
          create: {
            width: width,
            height: height,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 0 },
          },
        })
          .raw()
          .toColourspace("rgba")
          .ensureAlpha()
          .toBuffer({ resolveWithObject: true });

          // Draw a pretty picture
          // TODO: Make this configurable or random
          for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
              const red = Math.sin(x * y) * 255;
              const green = Math.cos(x * y) * 255;
              const blue = Math.tan(x * y) * 255;
              const index = (y * width + x) * 4;
              imageData.data[index] = red;
              imageData.data[index + 1] = green;
              imageData.data[index + 2] = blue;
              imageData.data[index + 3] = 255;
            }
          }

          // Write to a file
          const finalImage = sharp(imageData.data, {
            raw: {
              width,
              height,
              channels: 4,
            },
          }).png()

          if (useStdout(options.output)) {
            finalImage.pipe(process.stdout);
          } else {
            const outputPath = options.output || "output.png";
            await finalImage.toFile(outputPath);
            process.stderr.write(`Output to ${outputPath}\n`);
          }
      } catch (err) {
        console.log("Error: " + err);
      }
    });

  return program;
}
