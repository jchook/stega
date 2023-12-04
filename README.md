<h1 align="center">Stega PNG</h1>

<p align="center">
  <a href="https://stegapng.netlify.app/">
    <img src="https://github.com/jchook/stega/blob/main/public/stega-nobg.png?raw=true" width="300" />
  </a>
</p>

<p align="center">
  Hide secret messages in image files.
</p>

<p align="center">
  <a href="https://stegapng.netlify.app/">View Demo</a>
</p>


How It Works
------------

This demo uses steganography to embed secret data into an image.

The secret message is encoded stochastically into the least-significant bits of the image's pixel data, making it invisible to the naked eye and difficult to detect.

Note: All operations are performed locally on your web browser. None of your data are transmitted over the network.


Usage
-----

```sh
pnpm install
pnpm dev
```


More Details
------------

Since PNG images use lossless compression, it is possible to store secret data
in the least significant bits of the image's RGB (red, green, and blue) colorspace data. Alpha (transparency) channels are ignored since using alpha LSBs would make it trivial to detect the presence of hidden data.

A [linear congruential generator (LCG)](https://en.wikipedia.org/wiki/Linear_congruential_generator) allows us to very efficiently choose target pixel channels pseudorandomly on a "full cycle". This means that the available space to store data is maximized without needing to generate large arrays of shuffled indices, keep track of "used" channels, or wrestle with probabalistic output.

The LCG parameters are chosen as follows:

- length, the length of the image RGBA colorspace data
- modulus, the nearest power of 2 ≥ length
- multiplier, the nearest a ≥ sqrt(length) s.t. a-1 ≡ 5 modulo 8, and a is relatively prime to modulus
- increment, 1
- seed, the sum of the height and width of the image

The data is embedded in the following format:

- 8 bits of option flags (currently unused)
- 32 bits to store the length of the secret data
- the secret data

Currently only the least significant bit of each target channel is used to store secret data. However, there are plans to expand this to use up to n LSBs, trading detectability for larger data storage capacity.


Contributing
------------

Feel free to submit pull requests.


Roadmap
-------

- CLI tool
- Support embedding/extracting files and binary data instead of just text
- Detection tool to reveal whether data is hidden in a PNG's LSBs


License
-------

MIT
