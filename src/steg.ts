import { imageChannelIndexGenerator } from "./lcg";

type RgbaData = Uint8ClampedArray | Buffer;

export function embedDataInImage(rgba: RgbaData, data: Uint8Array): void {
  // Get an LCG generator to generate the indices of the pixels to embed data
  // in. The generator will skip indices that are out of bounds or are the
  // alpha channel.
  const imageDataLength = rgba.length;
  const indexGenerator = imageChannelIndexGenerator(
    imageDataLength,
    Math.floor(rgba.length / 8)
  );

  let dataLengthBinaryString = data.length.toString(2);
  let bitsEmbedded: string = "";

  const embedBits = (bits: number, length = 8) => {
    for (let bitIndex = 0; bitIndex < length; bitIndex++) {
      const index = indexGenerator.next().value;
      const bit = (bits >> bitIndex) & 1;
      bitsEmbedded += bit;
      rgba[index] = setLSB(rgba[index], bit);
    }
  };

  // Embed an option byte in the first 8 bits of the image.
  // This allows us to add options in the future.
  embedBits(0);

  // Embed the length of the data in the first 32 bits of the image.
  // This allows us to know how many bytes to read when extracting.
  embedBits(data.length, 32);

  // Reverse the data length binary string
  dataLengthBinaryString = dataLengthBinaryString.split("").reverse().join("");

  for (let byte of data) {
    embedBits(byte);
  }
}

function setLSB(byte: number, bit: number): number {
  return (byte & 0xfe) | bit;
}

export function extractDataFromImage(rgba: RgbaData): Uint8Array {
  const imageDataLength = rgba.length;
  const indexGenerator = imageChannelIndexGenerator(
    imageDataLength,
    Math.floor(rgba.length / 8)
  );
  const indexes: number[] = [];

  const extractBits = (length = 8): number => {
    let bits = 0;
    for (let bitIndex = 0; bitIndex < length; bitIndex++) {
      const index = indexGenerator.next().value;
      indexes.push(index);
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
