import { imageChannelIndexGenerator } from "./lcg";

/**
 * RGBA colorspace data. A one-dimensional array containing the data in the
 * RGBA order, with integer values. The order goes by rows from the top-left
 * pixel to the bottom-right.
 *
 * In a browser context, this data is obtained by calling getImageData() on a
 * canvas element. In a Node.js context, you can use a library such as sharp to
 * get the colorspace data of an image.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/ImageData
 * @see https://sharp.pixelplumbing.com/api-colour#tocolourspace
 */
export type RgbaData = Uint8ClampedArray | Buffer;

/**
 * Embeds hidden data into an image's RGBA colorspace data.
 *
 * Data is embedded into "random" pixel channels. The order is determined by an
 * LCG generator. The generator will skip indices that are out of bounds or are
 * the alpha channel.
 *
 * Choosing an LCG generator ensures that storage capacity is maximized, while
 * the data is also stochastically distributed throughout the image.
 */
export function embedDataInImage(
  rgba: RgbaData,
  data: Uint8Array,
  seed: number | undefined = undefined
): void {
  // Get an LCG generator to generate the indices of the pixels to embed data
  // in. The generator will skip indices that are out of bounds or are the
  // alpha channel.
  const imageDataLength = rgba.length;
  const indexGeneratorSeed = seed ?? Math.floor(rgba.length / 8);
  const indexGenerator = imageChannelIndexGenerator(
    imageDataLength,
    indexGeneratorSeed
  );

  // Check to see if the image is large enough to embed the data
  const maxDataLength = Math.floor(((imageDataLength / 4) * 3) / 8);
  if (data.length > maxDataLength) {
    throw new Error(
      `Data is too large to embed in image. Max data length is ${maxDataLength}.`
    );
  }

  const embedBits = (bits: number, length = 8) => {
    for (let bitIndex = 0; bitIndex < length; bitIndex++) {
      const index = indexGenerator.next().value;
      const bit = (bits >> bitIndex) & 1;
      rgba[index] = setLSB(rgba[index], bit);
    }
  };

  // Embed an option byte in the first 8 bits of the image.
  // This allows us to add options in the future.
  embedBits(0);

  // Embed the length of the data in the first 32 bits of the image.
  // This allows us to know how many bytes to read when extracting.
  embedBits(data.length, 32);

  for (let byte of data) {
    embedBits(byte);
  }
}

function setLSB(byte: number, bit: number): number {
  return (byte & 0xfe) | bit;
}

/**
 * Extracts hidden data from an image's RGBA colorspace data.
 * Inverse of embedDataInImage.
 */
export function extractDataFromImage(
  rgba: RgbaData,
  seed: number | undefined = undefined
): Uint8Array {
  const imageDataLength = rgba.length;
  const indexGeneratorSeed = seed ?? Math.floor(rgba.length / 8);
  const indexGenerator = imageChannelIndexGenerator(
    imageDataLength,
    indexGeneratorSeed
  );

  const extractBits = (length = 8): number => {
    let bits = 0;
    for (let bitIndex = 0; bitIndex < length; bitIndex++) {
      const index = indexGenerator.next().value;
      const bit = getLSB(rgba[index], 1);
      bits |= bit << bitIndex;
    }
    return bits;
  };

  // Extract the option byte from the first 8 bits of the image.
  // This allows us to add options in the future.
  extractBits(8);

  // Extract the length of the data from the first 32 bits of the image.
  // This allows us to know how many bytes to read when extracting.
  const dataLength = extractBits(32);

  // Extract the data
  const data = new Uint8Array(dataLength);
  for (let i = 0; i < dataLength; i++) {
    data[i] = extractBits(8);
  }

  return data;
}

function getLSB(byte: number, bitCount: number): number {
  const mask: number = (1 << bitCount) - 1;
  return byte & mask;
}
