import { describe, it, assert } from "vitest";
import { imageChannelIndexGenerator, getMaxDataLength } from "./lcg";

describe("imageChannelIndexGenerator", () => {
  it("generates the same sequence for the same seed", () => {
    const length = 100;
    const max = getMaxDataLength(length);
    const gen1 = imageChannelIndexGenerator(length, length - 1);
    const gen2 = imageChannelIndexGenerator(length, length - 1);
    for (let i = 0; i < max; i++) {
      assert.equal(gen1.next().value, gen2.next().value);
    }
  });
  it("generates different sequences for different seeds", () => {
    const length = 100;
    const max = getMaxDataLength(length);
    const gen1 = imageChannelIndexGenerator(length, length - 1);
    const gen2 = imageChannelIndexGenerator(length, length - 2);
    for (let i = 0; i < max; i++) {
      assert.notEqual(gen1.next().value, gen2.next().value);
    }
  });
  it("generates different sequences for different lengths", () => {
    const length = 100;
    const max = getMaxDataLength(length);
    const gen1 = imageChannelIndexGenerator(length, length - 1);
    const gen2 = imageChannelIndexGenerator(length * 4, length - 1);
    for (let i = 0; i < max; i++) {
      assert.notEqual(gen1.next().value, gen2.next().value);
    }
  });
  it("never generates an index that is out of bounds", () => {
    const length = 100;
    const max = getMaxDataLength(length);
    const gen = imageChannelIndexGenerator(length, length - 1);
    for (let i = 0; i < max; i++) {
      assert(gen.next().value < 100);
    }
  });
  it("never generates the same index twice", () => {
    const length = 100;
    const max = getMaxDataLength(length);
    const gen = imageChannelIndexGenerator(length, length - 1);
    const prev: number[] = [];
    for (let i = 0; i < max; i++) {
      const next = gen.next().value;
      assert.notIncludeMembers(prev, [next]);
      prev.push(next);
    }
  });
  it("never generates an alpha channel index", () => {
    const length = 100;
    const max = getMaxDataLength(length);
    const gen = imageChannelIndexGenerator(length, length - 1);
    for (let i = 0; i < max; i++) {
      assert(gen.next().value % 4 !== 3);
    }
  });
  it("generates a full cycle of indices for a large length", () => {
    const length = 100000;
    const max = getMaxDataLength(length);
    const gen = imageChannelIndexGenerator(length, length - 1);
    const indexes = new Set<number>();
    for (let i = 0; i < max; i++) {
      indexes.add(gen.next().value);
    }
    assert.equal(indexes.size, length * 0.75);
  });
  it("blows up if you try to exceed the limit", () => {
    const length = 1000;
    const max = getMaxDataLength(length);
    const gen = imageChannelIndexGenerator(length, length - 1);
    const indexes = new Set<number>();
    for (let i = 0; i < max; i++) {
      indexes.add(gen.next().value);
    }
    assert.throw(() => gen.next());
  });
});
