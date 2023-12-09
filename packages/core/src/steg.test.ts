import { describe, it, assert } from "vitest";
import { embedDataSegmentsInImage, extractDataSegmentsFromImage, getImageContext } from "./steg";

describe("embedDataSegmentsInImage", () => {
  it("returns undefined", () => {
    const data = Buffer.from("Hello World!");
    const image = Buffer.from(new Array(400).fill(0));
    const dataSegments = [{ type: 0, data }];
    const imageContext = getImageContext(image)
    const result = embedDataSegmentsInImage(imageContext, dataSegments);
    assert(result === undefined);
  });
  it("embeds data in image", () => {
    const data = Buffer.from("Hello World!");
    const image = Buffer.from(new Array(400).fill(0));
    const dataSegments = [{ type: 0, data }];
    const imageContext = getImageContext(image)
    embedDataSegmentsInImage(imageContext, dataSegments);
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
  // TODO: Move this logic to the indexGenerator
  // it("throws if data is too large", () => {
  //   const data = Buffer.from(new Array(100).fill(0));
  //   const image = Buffer.from(new Array(100).fill(0));
  //   assert.throws(() => embedDataInImage(image, data));
  // })
});

describe("extractDataSegmentsFromImage", () => {
  it("extracts data embedded in an image", () => {
    const message = "Hello World!";
    const data = Buffer.from(message);
    const image = Buffer.from(new Array(4000).fill(0));
    const dataSegments = [{ type: 0, name: undefined, data }];
    const imageContextEmbed = getImageContext(image)
    embedDataSegmentsInImage(imageContextEmbed, dataSegments);
    const imageContext = getImageContext(image)
    const extractResult = extractDataSegmentsFromImage(imageContext);
    assert.deepEqual(extractResult, dataSegments);
    // Decode data as UTF-8
    const decoded = new TextDecoder().decode(extractResult[0].data);
    assert.equal(decoded, message)
  });
});
