import { describe, it, assert } from "vitest";
import { imageChannelIndexGenerator } from "./lcg";

describe("imageChannelIndexGenerator", () => {
  it("should generate the same sequence for the same seed", () => {
    const gen1 = imageChannelIndexGenerator(100, 123);
    const gen2 = imageChannelIndexGenerator(100, 123);
    for (let i = 0; i < 100; i++) {
      assert.equal(gen1.next().value, gen2.next().value);
    }
  });
  it("should generate different sequences for different seeds", () => {
    const gen1 = imageChannelIndexGenerator(100, 123);
    const gen2 = imageChannelIndexGenerator(100, 456);
    for (let i = 0; i < 100; i++) {
      assert.notEqual(gen1.next().value, gen2.next().value);
    }
  });
  it("should generate different sequences for different lengths", () => {
    const gen1 = imageChannelIndexGenerator(100, 123);
    const gen2 = imageChannelIndexGenerator(200, 123);
    for (let i = 0; i < 100; i++) {
      assert.notEqual(gen1.next().value, gen2.next().value);
    }
  });
  it("should never generate an index that is out of bounds", () => {
    const length = 100;
    const gen = imageChannelIndexGenerator(length, 123);
    for (let i = 0; i < length; i++) {
      assert(gen.next().value < 100);
    }
  }
  );
  it("should never generate the same index twice in a row", () => {
    const length = 100;
    const gen = imageChannelIndexGenerator(length, 123);
    let prev = gen.next().value;
    for (let i = 0; i < length; i++) {
      const next = gen.next().value;
      assert.notEqual(prev, next);
      prev = next;
    }
  }
  );
});
