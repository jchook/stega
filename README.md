<h1 align="center">Stega PNG</h1>

<p align="center">
  <a href="https://stegapng.netlify.app/">
    <img src="https://github.com/jchook/stega/blob/main/packages/web/public/stega-nobg.png?raw=true" width="300" />
  </a>
</p>

<p align="center">
  Hide arbitrary data in an image's RGB colorspace.
</p>

<p align="center">
  <a href="https://stegapng.netlify.app/">View Demo</a>
</p>

How It Works
------------

Stega PNG uses [steganography](https://en.wikipedia.org/wiki/Steganography) to embed invisible secret data into an image.

The secret data are encoded stochastically into the least-significant bits of the image's RGB pixel data, making it invisible to the naked eye and difficult to detect.

[Check out the demo](https://stegapng.netlify.app/). For more details about the algorithm, see the [core library](./packages/core/README.md), or to use the tool in your workflow, see the [CLI utility](./packages/cli/README.md).


Packages
--------

- [Command line utility](./packages/cli/README.md)
- [Core library](./packages/core/README.md)
- [Web browser demo](./packages/web/README.md)


Contributing
------------

Feel free to open an issue or submit a pull request.


Roadmap
-------

- [x] Basic proof of concept (Web demo)
- [x] Factor-out portable TypeScript core
- [x] CLI tool
- [ ] Embedding/extracting consecutive chunks of data including multiple files and their metadata
- [ ] Detection mode to predict or illustrate whether data is hidden in a PNG's LSBs
- [ ] Efficient rewrite in Go/Rust/etc


License
-------

MIT
