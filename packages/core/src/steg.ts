import { imageChannelIndexGenerator } from "./lcg";

/**
 * This character ends the filename data sequence.
 *
 * We choose '/' because it is disallowed on all major operating systems.
 * https://stackoverflow.com/questions/1976007/what-characters-are-forbidden-in-windows-and-linux-directory-names
 *
 * Yes '/' has an uneven bit distribution (101111), but this is offset by the
 * FILE data type byte, which has the inverse bit distribution (000001).
 */
export const FILE_NAME_END = 47; // '/'

/**
 * Which data type is being embedded.
 * This is designed to accommodate future improvements to the data structure.
 */
export enum DataSegmentType {
  RAW = 0,
  FILE = 1,
  END = 255,
}

/**
 * Many data segments can be embedded in an image.
 */
export interface DataSegment {
  type: number;
  data: Uint8Array;
  name?: string;
}


/**
 * Data is embedded into "random" pixel channels. The order is determined by an
 * LCG generator. The generator is seeded with the length of the RGBA colorspace
 * divided by 8. This ensures that the same image will always embed data in the
 * same order.
 *
 * The LCG generator is defined in lcg.ts. It is a simple implementation of the
 * LCG algorithm. It is not cryptographically secure, but it is good enough for
 * this application.
 */
type RgbaData = Uint8ClampedArray | Buffer;

interface ImageContext {
  rgba: RgbaData;
  indexGenerator: Generator<number>;
}

export function getImageContext(rgba: RgbaData): ImageContext {
  // Get an LCG generator to generate the indices of the pixels to embed data
  // in. The generator will skip indices that are out of bounds or are the
  // alpha channel.
  const imageDataLength = rgba.length;
  const indexGenerator = imageChannelIndexGenerator(
    imageDataLength,
    Math.floor(rgba.length / 8)
  );
  return {
    rgba,
    indexGenerator: indexGenerator,
  };
}

export function embedDataInImage(image: RgbaData, data: Uint8Array): void {
  const imageContext = getImageContext(image);
  embedDataSegmentsInImage(imageContext, [{ type: DataSegmentType.RAW, data }]);
}

export function extractDataFromImage(image: RgbaData): Uint8Array {
  const imageContext = getImageContext(image);
  const dataSegments = extractDataSegmentsFromImage(imageContext);
  if (dataSegments.length !== 1) {
    throw new Error("Expected 1 data segment");
  }
  const dataSegment = dataSegments[0];
  if (dataSegment.type !== DataSegmentType.RAW) {
    throw new Error("Expected RAW data segment");
  }
  return dataSegment.data;
}

/**
 * Embeds hidden data into an image's RGBA colorspace data.
 */
export function embedDataSegmentsInImage(imageContext: ImageContext, dataSegments: DataSegment[]): void {
  const { rgba, indexGenerator } = imageContext;

  // Note, do not use this function to embed more than ~32 bits at one time
  const embedBits = (bits: number, length = 8) => {
    for (let bitIndex = 0; bitIndex < length; bitIndex++) {
      const index = indexGenerator.next().value;
      const bit = (bits >> bitIndex) & 1;
      rgba[index] = setLSB(rgba[index], bit);
    }
  };

  for (const dataSegment of dataSegments) {
    const { type, name, data } = dataSegment;

    // Embed an option byte in the first 8 bits of the image.
    // This allows us to add options in the future.
    embedBits(type);

    // If the type is FILE, embed the file name in the image.
    if (type === DataSegmentType.FILE) {
      const nameBytes = new TextEncoder().encode(name || "");
      for (let byte of nameBytes) {
        embedBits(byte);
      }
      embedBits(FILE_NAME_END);
    }

    // Embed the length of the data in the first 32 bits of the image.
    // This allows us to know how many bytes to read when extracting.
    embedBits(data.length, 32);

    // Embed the data itself
    for (let byte of data) {
      embedBits(byte);
    }
  }
  embedBits(DataSegmentType.END);
}

function setLSB(byte: number, bit: number): number {
  return (byte & 0xfe) | bit;
}

export function extractDataSegmentsFromImage(imageContext: ImageContext): DataSegment[] {
  const dataSegments: DataSegment[] = [];
  while (true) {
    const dataSegment = extractDataSegmentFromImage(imageContext);
    if (dataSegment === undefined) {
      break;
    }
    dataSegments.push(dataSegment);
  }
  return dataSegments;
}

/**
 * Extracts hidden data from an image's RGBA colorspace data.
 * Inverse of embedDataInImage.
 */
export function extractDataSegmentFromImage(imageContext: ImageContext): DataSegment | undefined {
  const { rgba, indexGenerator } = imageContext;

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
  const type = extractBits(8);

  // If the type is END, we have reached the end of the data.
  if (type === DataSegmentType.END) {
    return undefined;
  }

  // If the type is FILE, extract the file name from the image.
  let name: string | undefined;
  if (type === DataSegmentType.FILE) {
    const nameBytes: number[] = [];
    while (true) {
      const byte = extractBits(8);
      if (byte === FILE_NAME_END) {
        break;
      }
      nameBytes.push(byte);
    }
    name = new TextDecoder().decode(Uint8Array.from(nameBytes));
  }

  if (type !== DataSegmentType.FILE && type !== DataSegmentType.RAW) {
    throw new Error("Unsupported data segment type");
  }

  // Extract the length of the data from the first 32 bits of the image.
  // This allows us to know how many bytes to read when extracting.
  const dataLength = extractBits(32);

  // Extract the data
  const data = new Uint8Array(dataLength);
  for (let i = 0; i < dataLength; i++) {
    data[i] = extractBits(8);
  }

  return {
    type,
    name,
    data,
  }
}

function getLSB(byte: number, bitCount: number): number {
  const mask: number = (1 << bitCount) - 1;
  return byte & mask;
}
