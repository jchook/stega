import { describe, it, assert } from "vitest";
import { embedDataInImage, extractDataFromImage } from "./steg";

describe("embedDataInImage", () => {
  it("returns undefined", () => {
    const data = Buffer.from("Hello World!");
    const image = Buffer.from(new Array(400).fill(0));
    const result = embedDataInImage(image, data);
    assert(result === undefined);
  });
  it("embeds data in image", () => {
    const data = Buffer.from("Hello World!");
    const image = Buffer.from(new Array(400).fill(0));
    embedDataInImage(image, data);
    // Sum all the 1 bits in the data
    let dataSum = 0;
    for (let i = 0; i < data.length; i++) {
      const byte = data[i];
      for (let j = 0; j < 8; j++) {
        const bit = (byte >> j) & 1;
        dataSum += bit;
      }
    }
    // The image should have the data embedded in it
    const imageSum = image.reduce((a, b) => a + b, 0);
    assert.isAbove(imageSum, dataSum);
  });
  it("throws if data is too large", () => {
    const data = Buffer.from(new Array(100).fill(0));
    const image = Buffer.from(new Array(100).fill(0));
    assert.throws(() => embedDataInImage(image, data));
  })
});

describe("extractDataFromImage", () => {
  it("extracts data embedded in an image", () => {
    const message = "Hello World!";
    const data = Buffer.from(message);
    const image = Buffer.from(new Array(4000).fill(0));
    embedDataInImage(image, data);
    const extractResult = extractDataFromImage(image);
    assert.deepEqual(extractResult, data);
    // Decode data as UTF-8
    const decoded = new TextDecoder().decode(extractResult);
    assert.equal(decoded, message)
  });
});
