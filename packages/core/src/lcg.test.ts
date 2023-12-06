import { describe, it, assert } from "vitest";
import { imageChannelIndexGenerator } from "./lcg";

describe("imageChannelIndexGenerator", () => {
  it("generates the same sequence for the same seed", () => {
    const gen1 = imageChannelIndexGenerator(100, 123);
    const gen2 = imageChannelIndexGenerator(100, 123);
    for (let i = 0; i < 100; i++) {
      assert.equal(gen1.next().value, gen2.next().value);
    }
  });
  it("generates different sequences for different seeds", () => {
    const gen1 = imageChannelIndexGenerator(100, 123);
    const gen2 = imageChannelIndexGenerator(100, 456);
    for (let i = 0; i < 100; i++) {
      assert.notEqual(gen1.next().value, gen2.next().value);
    }
  });
  it("generates different sequences for different lengths", () => {
    const gen1 = imageChannelIndexGenerator(100, 123);
    const gen2 = imageChannelIndexGenerator(200, 123);
    for (let i = 0; i < 100; i++) {
      assert.notEqual(gen1.next().value, gen2.next().value);
    }
  });
  it("never generates an index that is out of bounds", () => {
    const length = 100;
    const gen = imageChannelIndexGenerator(length, 123);
    for (let i = 0; i < length; i++) {
      assert(gen.next().value < 100);
    }
  });
  it("never generates the same index twice in a row", () => {
    const length = 100;
    const gen = imageChannelIndexGenerator(length, 123);
    let prev = gen.next().value;
    for (let i = 0; i < length; i++) {
      const next = gen.next().value;
      assert.notEqual(prev, next);
      prev = next;
    }
  });
  it("never generates an alpha channel index", () => {
    const length = 100;
    const gen = imageChannelIndexGenerator(length, 123);
    for (let i = 0; i < length; i++) {
      assert(gen.next().value % 4 !== 3);
    }
  });
  it("generates a full cycle of indices for a large length", () => {
    const length = 100000;
    const gen = imageChannelIndexGenerator(length, 123);
    const indexes = new Set<number>();
    for (let i = 0; i < length; i++) {
      indexes.add(gen.next().value);
    }
    assert.equal(indexes.size, length * 0.75);
  });
  it("wraps around to the beginning of the sequence", () => {
    const length = 100;
    const gen = imageChannelIndexGenerator(length, 123);
    const first = gen.next().value;
    for (let i = 0; i < length * 0.75 - 1; i++) {
      gen.next().value;
    }
    assert.equal(gen.next().value, first);
  });
});
