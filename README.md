<h1 align="center">Stega PNG</h1>

<p align="center">
  <a href="https://stegapng.netlify.app/">
    <img src="https://github.com/jchook/stega/blob/main/packages/web/public/stega-nobg.png?raw=true" width="300" />
  </a>
</p>

<p align="center">
  Hide secret messages in an image's RGB colorspace.
</p>

<p align="center">
  <a href="https://stegapng.netlify.app/">View Demo</a>
</p>

Packages
--------

- [Command line utility](./packages/cli/README.md)
- [Core library](./packages/core/README.md)
- [Web browser demo](./packages/web/README.md)


How It Works
------------

This demo uses steganography to embed secret data into an image.

The secret message is encoded stochastically into the least-significant bits of the image's RGB pixel data, making it invisible to the naked eye and difficult to detect.

[Check out the demo](https://stegapng.netlify.app/) or, for more details about the algorithm, see the [core library](./packages/core/README.md).


Contributing
------------

Feel free to submit pull requests.


Roadmap
-------

- Support embedding/extracting files and binary data in the demo
- Support for embedding file names for easy/meaningful extraction
- Detection tool to reveal whether data is hidden in a PNG's LSBs


License
-------

MIT
