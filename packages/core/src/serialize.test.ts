// Test the serialize.ts file functions.
import { describe, it, assert } from "vitest";
import { serializeDataSegment } from "./serialize";

describe("serializeDataSegment", () => {
  it("serializes simple binary data", () => {
    const data = {
      type: 0,
      data: new Uint8Array([1, 2, 3, 4, 5]),
    };
    const result = serializeDataSegment(data);
    assert.deepEqual(
      result,
      new Uint8ClampedArray([0, 0, 0, 0, 5, 1, 2, 3, 4, 5])
    );
  });
});
