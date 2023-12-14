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
  <a href="https://stegapng.netlify.app/">View Demo</a> |
  <a href="https://github.com/jchook/stega/blob/main/packages/cli">CLI Utility</a>
</p>


How It Works
------------

Stega PNG uses [steganography](https://en.wikipedia.org/wiki/Steganography) to embed invisible data into an image.

We encode the data stochastically into the least-significant bits of the image's RGB colorspace data, making it invisible to the naked eye and difficult to detect.

Note, in real-world secnarios this tool is often combined with compression, encryption, and  a custom or configured bit selection process.


Packages
--------

- [Command line utility](./packages/cli/README.md)
- [Web browser demo](./packages/web/README.md)
- [Core library](./packages/core/README.md)


Use Case Examples
-----------------

1. **Freedom of Speech**: Journalists or others in sensitive political environments can use steganography to hide messages within images or videos, reducing the risk of interception by oppressive regimes.

1. **Secure File Sharing**: Individuals can use steganography to share sensitive documents or information by hiding them within innocuous files, reducing the likelihood of detection during transmission.

1. **Data Leakage**: Corporations can embed hidden markers in sensitive documents for each recipient. If these documents are leaked, the source of the leak can be traced using the embedded information.

1. **Anti-Piracy**: Software and media companies can embed unique identifiers in distributed digital content to track and identify pirated copies.

1. **Personal Privacy**: Anyone can use steganography to hide personal information, treasure maps, or sensitive data from being easily accessible or viewed.

1. **Research**: Privacy researchers can use Stega PNG as an easy-to-use framework for testing different steganographic techniques or attacks.

1. **For Fun**: Good for puzzles, challenges, inside jokes, or similar.


Please use this software ethically and for just cause.


Contributing,
------------

Feel free to open an issue or submit a pull request.


Roadmap
-------

- [x] Basic proof of concept (Web demo)
- [x] Factor-out portable TypeScript core
- [x] CLI tool
- [ ] Configurable bit selection process, perhaps with a password
- [ ] Detection mode to predict or illustrate whether data is hidden in a PNG's LSBs
- [ ] Efficient rewrite in Go/Rust/etc
- [ ] GUI tool


License
-------

MIT
