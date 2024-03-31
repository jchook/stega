import sharp from "sharp";
import path from "path";
import fs from "fs";
import { Command } from "commander";
import { embedDataInImage, extractDataFromImage } from "@stegapng/core";
import {
  readStdinToBuffer,
  useStdin,
  useStdout,
  debug,
  createStreamWriter,
  createStdoutWriter,
} from "./stdio";
import { mandelbrotZoom } from "./draw";
import packageJson from "../package.json";

const DEFAULT_OUTPUT_PATH = "output.png";

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
    .argument("[data]", "Path to a data file to embed (use - for stdin)")
    .option("-s, --seed <number>", "Seed for the random number generator")
    .option("-o, --output <output>", "Output file (use - for stdout)")
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
        const outputPath = options.output || DEFAULT_OUTPUT_PATH;
        if (!options.force) {
          assertNotPathExists(outputPath);
        }
        await finalImage.png().toFile(outputPath);
        debug(`Output to ${outputPath}\n`);
      }
    });

  program
    .command("extract")
    .alias("x")
    .description("Extract data from an image or multiple images")
    .argument("[images...]", "Path to image(s) to extract data from")
    .option("-s, --seed <number>", "Seed for the random number generator")
    .option("-o, --output <output>", "Output file (use - for stdout)")
    .option("-f, --force", "Overwrite output file if it exists")
    .action(async (imagePaths, options) => {
      const seed = options.seed ? parseInt(options.seed) : undefined;
      const streamWriter = (() => {
        if (useStdout(options.output)) {
          return createStdoutWriter();
        } else {
          const outputPath = options.output || DEFAULT_OUTPUT_PATH;
          if (!options.force) {
            assertNotPathExists(options.output);
          }
          return createStreamWriter(outputPath);
        }
      })();
      if (imagePaths.length === 0) {
        imagePaths.push("-");
      }
      for (const imagePath of imagePaths) {
        const imageData = await sharp(
          useStdin(imagePath) ? await readStdinToBuffer() : imagePath,
        )
          .raw()
          .toColourspace("rgba")
          .ensureAlpha()
          .toBuffer();
        const data = extractDataFromImage(imageData, seed);
        await streamWriter.write(data);
      }
    });

  program
    .command("genpng")
    .description("Generate a PNG file")
    .argument("[width]", "Width of the image", 256)
    .argument("[height]", "Height of the image", 256)
    .option("-o, --output <output>", "Output file (use - for stdout)")
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
          debug(err.message);
          process.exit(1);
        });
      } else {
        const outputPath = options.output || DEFAULT_OUTPUT_PATH;
        if (!options.force) {
          assertNotPathExists(outputPath);
        }
        await finalImage.toFile(outputPath);
        debug(`Output to ${outputPath}\n`);
      }
    });

  // Completions
  program
    .command("completions", { hidden: true })
    .description("Print shell completions for zsh or bash")
    .argument("[shell]", "The shell to generate completions for")
    .action((shellInput) => {
      const shell =
        shellInput || path.basename(process.env.SHELL ?? "") || "bash";
      const file = path.join(__dirname, "completions", `stega.${shell}`);
      if (!fs.existsSync(file)) {
        console.error(`Unsupported shell: ${shell}`);
        process.exit(1);
      }
      console.log(fs.readFileSync(file, "utf-8"));
    });

  return program;
}
