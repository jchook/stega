import sharp from "sharp";
import fs from "fs";
import { Command } from "commander";
import { embedDataInImage, extractDataFromImage } from "@stegapng/core";
import { readStdinToBuffer } from "./stdio";
import { mandelbrotZoom } from "./draw";
import packageJson from "../package.json";

const useStdin = (x: string | undefined) => !x || x === "-";
const useStdout = (x: string | undefined) =>
  (!x && !process.stdout.isTTY) || x === "-";

function assertNotPathExists(path: string) {
  if (fs.existsSync(path)) {
    throw new Error(`File ${path} exists`);
  }
  return path;
}

export function createProgram() {
  const program = new Command();
  program
    .name("stega")
    .version(packageJson.version)
    .description("A command line tool for steganography");

  program
    .command("embed")
    .alias("c")
    .description("Embed data in an image")
    .argument("<image>", "Path to an image to embed data in")
    .argument("[data]", "Path to a data file to embed")
    .option("-s, --seed <number>", "Seed for the random number generator")
    .option("-o, --output <output>", "Output file")
    .option("-f, --force", "Overwrite output file if it exists")
    .action(async (imagePath, dataPath, options) => {
      const seed = options.seed ? parseInt(options.seed) : undefined;
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
          : fs.readFileSync(dataPath),
        seed,
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
        await new Promise((resolve, reject) => {
          finalImage
            .png()
            .pipe(process.stdout)
            .on("error", reject)
            .on("finish", resolve);
        });
      } else {
        const outputPath = options.output || "output.png";
        if (!options.force) {
          assertNotPathExists(outputPath);
        }
        await finalImage.png().toFile(outputPath);
        process.stderr.write(`Output to ${outputPath}\n`);
      }
    });

  program
    .command("extract")
    .alias("x")
    .description("Extract data from an image")
    .argument("<image>", "Path to an image to extract data from")
    .option("-s, --seed <number>", "Seed for the random number generator")
    .option("-o, --output <output>", "Output file")
    .option("-f, --force", "Overwrite output file if it exists")
    .action(async (imagePath, options) => {
      const seed = options.seed ? parseInt(options.seed) : undefined;
      const imageData = await sharp(imagePath)
        .raw()
        .toColourspace("rgba")
        .ensureAlpha()
        .toBuffer({ resolveWithObject: true });
      const data = extractDataFromImage(imageData.data, seed);
      if (options.output === "-" || !options.output) {
        await new Promise<void>((resolve, reject) => {
          process.stdout.write(data, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      } else {
        if (!options.force) {
          assertNotPathExists(options.output);
        }
        process.stderr.write(`Output to ${options.output}\n`);
        fs.writeFileSync(options.output, data);
      }
    });

  program
    .command("genpng")
    .description("Generate a PNG file")
    .argument("[width]", "Width of the image", "256")
    .argument("[height]", "Height of the image", "256")
    .option("-o, --output <output>", "Output file")
    .option("-f, --force", "Overwrite output file if it exists")
    .action(async (widthStr, heightStr, options) => {
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

      mandelbrotZoom(imageData);

      // Write to a file
      const finalImage = sharp(imageData.data, {
        raw: {
          width,
          height,
          channels: 4,
        },
      }).png();

      if (useStdout(options.output)) {
        finalImage.pipe(process.stdout).on("error", (err) => {
          process.stderr.write(err.message);
          process.exit(1);
        });
      } else {
        const outputPath = options.output || "output.png";
        if (!options.force) {
          assertNotPathExists(outputPath);
        }
        await finalImage.toFile(outputPath);
        process.stderr.write(`Output to ${outputPath}\n`);
      }
    });

  return program;
}
