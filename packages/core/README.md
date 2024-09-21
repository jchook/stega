<h1 align="center">Stega PNG Core Library</h1>

<p align="center">
  <a href="https://stegapng.netlify.app/">
    <img src="https://github.com/jchook/stega/blob/main/packages/web/public/stega-nobg.png?raw=true" width="300" />
  </a>
</p>

<p align="center">
  Part of the <a href="https://github.com/jchook/stega">Stega PNG project</a>.
</p>

<p align="center">
  <a href="https://stegapng.netlify.app/">Browser Demo</a> |
  <a href="https://github.com/jchook/stega/blob/main/packages/cli">CLI Utility</a>
</p>


About
-----

<p>
  <a href="#"><img src="https://img.shields.io/badge/test%20coverage-100%25-brightgreen" title="100% Test Coverage" /></a>
  <a href="#"><img src="https://img.shields.io/badge/license-MIT-brightgreen" title="MIT License" /></a>
</p>


Stega PNG allows you to hide arbitrary data into the RGBA colorspace data of images.

Read the [API documentation](./docs/README.md).


Install
-------

To use this core library in your JavaScript or TypeScript project, add it to your project's dependencies using your preferred Node package manager:

```sh
npm install @stegapng/core
```


Colorspace Encoding
-------------------

Since PNG images use lossless compression, it is possible to store invisible data in the least significant bits of the image's RGB (red, green, and blue) colorspace. Alpha (transparency) channels are ignored since using alpha LSBs would often make it trivial to detect the presence of hidden data.


Where To Embed the Bits?
------------------------

By default, we use a least-significant bit (LSB) embedding. A [linear congruential generator (LCG)](https://en.wikipedia.org/wiki/Linear_congruential_generator) allows us to very efficiently choose target pixel channels pseudorandomly on a "full cycle". This means that each pixel channel is picked at most exactly once. Thus, the available space to store data is maximized without needing to generate large arrays of shuffled indices, keep track of "used" channels, etc.


Data Encoding Scheme
====================

StegaV0
-------

The image is encoded as a one-dimensional array, containing the data in the RGBA (Red, Green, Blue, Alpha) order, with integer values between 0 and 255 (inclusive). The order goes by rows from the top-left pixel to the bottom-right. See [ImageData.data](https://developer.mozilla.org/en-US/docs/Web/API/ImageData/data).

A linear congruential generator (LCG) is constructed, such that the generator visits each RGBA array index (including alpha channels) exactly once in a stochastic order. Specifically:

1. For the modulus, we select the closest power of two larger than the length of the RGBA array.
1. For the multiplier, we first select the nearest odd number greater than the ceiling of the square root of the modulus. From there, if the integer is not congruent to 5 modulo 8, we find the nearest larger integer that satisfies that condition. This helps to ensure more random distributions.
1. For the increment, we choose 1, an odd number co-prime to the modulus.
1. For the seed, we accept a user-supplied value, or default to the length of the RGBA array divided by 8.

We skip indices emitted by the generator that correspond to alpha channels (i.e. skip indices that are congruent to 3 modulo 4) or out-of-bounds indices (those greater than the length of the RGBA array).

The full embedded data consists of three segments, in order:

| Segment         | Length  | Description                                |
|-----------------|---------|--------------------------------------------|
| Version         | 1 byte  | 0                                          |
| Data Length (L) | 4 bytes | Max 4GB, further limited by the image size |
| Data            | L bytes | Arbitrary user-supplied data               |

As the LCG visits each RGBA array index in a pseudorandom order, the next bit of the data is encoded into the least-significant bit (LSB) of the 1-byte value stored in that array index (ignoring the alpha channel). This process is repeated until all data segments are embedded into the RGBA array.

Next, the RGBA array is rendered as a lossless PNG file, which can be decoded by performing the inverse process.

In the inverse process, an identical LCG is generated to discover the embedded data in the correct order. The version byte MUST be 0. The data length is read first, then the data.

Arbitrary data can be encoded using this method, for example: the bits of an encrypted zip file. StegaV0 intentionally makes no attempt to store any filename or type information. For this purpose, you should use a separate tool such as `tar`. See the [CLI tool](../cli) for examples.

