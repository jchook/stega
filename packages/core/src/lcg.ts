/**
 * A Linear Congruential Generator (LCG) is a simple pseudo-random number
 * generator that uses a linear recurrence equation to generate a sequence of
 * numbers. The recurrence equation is:
 *
 *  Xn+1 = (a * Xn + c) mod m
 *  where:
 *  Xn is the current state
 *  a is the multiplier
 *  c is the increment
 *  m is the modulus
 *  and the initial state X0 is called the seed.
 *
 *  The modulus m must be greater than 0
 *  The multiplier a must be greater than 0 and less than m
 *  The increment c must be greater than or equal to 0 and less than m
 *  The seed X0 must be greater than or equal to 0 and less than m
 *
 *  The generator has a full cycle when the following conditions are met:
 *  c and m are relatively prime
 *  a - 1 is divisible by all prime factors of m
 *  a - 1 is a multiple of 4 if m is a multiple of 4
 *
 * See Knuth TAOCP Vol 2, 3rd Ed, §3.2.1
 */
class Lcg {
  private state: number;
  private modulus: number;
  private multiplier: number;
  private increment: number;

  constructor(
    seed: number,
    modulus: number,
    multiplier: number,
    increment: number
  ) {
    this.state = seed % modulus;
    this.modulus = modulus;
    this.multiplier = multiplier;
    this.increment = increment;
  }

  next(): number {
    this.state = (this.multiplier * this.state + this.increment) % this.modulus;
    return this.state;
  }
}

/**
 * Generate a sequence of ImageData indices starting at seed and counting up to
 * imageDataLength, then looping back around from 0. Skips indices that are out
 * of bounds or are the alpha channel.
 */
export function* imageChannelIndexGeneratorSimple(
  imageDataLength: number,
  seed: number
): Generator<number> {
  let index = seed % imageDataLength;
  while (true) {
    if (index >= imageDataLength) index = 0;
    if (index % 4 === 3) index++;
    yield index++;
  }
}

/**
 * Generate a pseudorandom full cycle of indices over the range of the image
 * data, skipping indices that are out of bounds or are the alpha channel.
 */
export function* imageChannelIndexGenerator(
  imageDataLength: number,
  seed: number
): Generator<number> {
  const { modulus, multiplier, increment } =
    getLcgParameters(imageDataLength);
  const lcg = new Lcg(seed, modulus, multiplier, increment);
  while (true) {
    const index = lcg.next();
    if (index >= imageDataLength) continue; // Skip if index is out of bounds
    if (index % 4 === 3) continue; // Skip alpha channel
    yield index; // Calculate actual array index, skipping alpha
  }
}

/**
 * Selecting a good multiplier and modulus for a Linear Congruential Generator
 * is a bit of a black art. This function will return a modulus, multiplier and
 * increment that should be suitable for generating a "full cycle" of numbers
 * over the range, meaning it will generate every number in the range exactly
 * once before repeating.
 *
 * The choice of multiplier is not guaranteed to produce statistically random
 * numbers that will beat a spectral test, but it should be good enough for
 * embedding data in images.
 */
function getLcgParameters(length: number) {
  // Use the closest power of 2 for the modulus
  const modulus = Math.pow(2, Math.ceil(Math.log2(length)));

  // Search for a suitable multiplier close to sqrt(modulus)
  let multiplier = Math.ceil(Math.sqrt(modulus));
  if (multiplier % 2 === 0) multiplier++; // Ensure it starts odd

  // Find the nearest integer that is congruent to 5 modulo 8
  while ((multiplier - 1) % 8 !== 4 || multiplier >= modulus) {
    multiplier += 2;
  }

  // Choosing 1 as the increment, an odd number
  // The increment must be coprime to the modulus
  const increment = 1;

  return { modulus, multiplier, increment };
}
