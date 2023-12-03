import { imageChannelIndexGenerator } from "./lcg";
import "./style.scss";

// Format:
// 1. The first byte is a set of flags/options. They are left undefined.
// 1. The next 32 bits hold the length of the data.
// 1. The rest of the data is stored in the remaining bits.
//
// Data is embedded into "random" pixel channels. The order is determined by an
// LCG generator. The generator is seeded with the sum of the width and height
// of the image. This ensures that the same image will always embed data in the
// same order.
//
// The LCG generator is defined in lcg.ts. It is a simple implementation of the
// LCG algorithm. It is not cryptographically secure, but it is good enough for
// this application.

const $ = document.querySelector.bind(document);

// When the page loads, bind a function to the onsubmit of the form #embedForm
window.onload = function () {
  const embedForm = $("#embedForm") as HTMLFormElement;
  embedForm.onsubmit = function (event) {
    event.preventDefault();
    embedSubmit();
  };
  const extractForm = $("#extractForm") as HTMLFormElement;
  extractForm.onsubmit = function (event) {
    event.preventDefault();
    extractSubmit();
  };
};

function embedSubmit() {
  const imageInput = $('#embedForm [name="coverFile"]') as HTMLInputElement;
  const dataInput = $('#embedForm [name="secret"]') as HTMLInputElement;
  const outputImage = $("#embedForm .output img") as HTMLImageElement;
  const outputDiv = $("#embedForm .output") as HTMLDivElement;

  const reader = new FileReader();
  reader.onload = function (event) {
    const img = new Image();
    img.onload = function () {
      const { context, imageData } = getImageData(img);
      const data: Uint8Array = new TextEncoder().encode(dataInput.value);
      embedDataInImage(imageData, data);
      context.putImageData(imageData, 0, 0);
      const dataURL = context.canvas.toDataURL();
      outputImage.onload = function () {
        // Decode the data from the image
        console.log("Decoding data from image...");
        const extractedData = extractDataFromImage(imageData);
        const decodedData = new TextDecoder().decode(extractedData);
        console.log({ decodedData });
      };
      outputImage.src = dataURL;
      outputDiv.style.display = "block";
    };
    if (typeof event?.target?.result === "string") {
      img.src = event.target.result;
    } else {
      console.log("Error: " + typeof event?.target?.result);
    }
  };
  if (imageInput.files) {
    reader.readAsDataURL(imageInput.files[0]);
  }
}

function extractSubmit() {
  const imageInput = $('#extractForm [name="imageFile"]') as HTMLInputElement;
  const outputDiv = $("#extractForm .output") as HTMLDivElement;
  const outputSecret = $(
    "#extractForm .output [name='secret']"
  ) as HTMLInputElement;

  const reader = new FileReader();
  reader.onload = function (event) {
    const img = new Image();
    img.onload = function () {
      const data = extractDataFromImage(getImageData(img).imageData);
      outputDiv.style.display = "block";
      outputSecret.value = new TextDecoder().decode(data);
    };
    if (typeof event?.target?.result === "string") {
      img.src = event.target.result;
    } else {
      console.log("Error: " + typeof event?.target?.result);
    }
  };
  if (imageInput.files) {
    reader.readAsDataURL(imageInput.files[0]);
  }
}

function getImageData(image: HTMLImageElement): {
  context: CanvasRenderingContext2D;
  imageData: ImageData;
} {
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const context = canvas.getContext("2d");
  if (context) {
    context.drawImage(image, 0, 0);
    return {
      context,
      imageData: context.getImageData(0, 0, image.width, image.height),
    };
  } else {
    throw new Error("Could not get canvas context");
  }
}

function embedDataInImage(imageData: ImageData, data: Uint8Array): void {
  // Get an LCG generator to generate the indices of the pixels to embed data
  // in. The generator will skip indices that are out of bounds or are the
  // alpha channel.
  const imageDataLength = imageData.data.length;
  const indexGenerator = imageChannelIndexGenerator(
    imageDataLength,
    imageData.height + imageData.width
  );

  let dataLengthBinaryString = data.length.toString(2);
  let bitsEmbedded: string = "";

  const embedBits = (bits: number, length = 8) => {
    for (let bitIndex = 0; bitIndex < length; bitIndex++) {
      const index = indexGenerator.next().value;
      const bit = (bits >> bitIndex) & 1;
      bitsEmbedded += bit;
      imageData.data[index] = setLSB(imageData.data[index], bit);
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

function extractDataFromImage(imageData: ImageData): Uint8Array {
  const imageDataLength = imageData.data.length;
  const indexGenerator = imageChannelIndexGenerator(
    imageDataLength,
    imageData.height + imageData.width
  );
  const indexes: number[] = [];

  const extractBits = (length = 8): number => {
    let bits = 0;
    for (let bitIndex = 0; bitIndex < length; bitIndex++) {
      const index = indexGenerator.next().value;
      indexes.push(index);
      const bit = getLSB(imageData.data[index], 1);
      bits |= bit << bitIndex;
    }
    return bits;
  };

  // Extract the option byte from the first 8 bits of the image.
  // This allows us to add options in the future.
  const options = extractBits(8);

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
