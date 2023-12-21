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
  <a href="https://github.com/jchook/stega/blob/main/packages/cli/README.md">CLI Utility</a>
</p>


How It Works
------------

Stega PNG uses [steganography](https://en.wikipedia.org/wiki/Steganography) to embed data invisibly into an image.

We encode the data stochastically into the least-significant bits of the image's RGB colorspace data, making it invisible to the naked eye and difficult to detect.

In real-world scenarios, one would combine this tool with compression, encryption, and non-default bit selection. You can achieve this easily using the [CLI utility](https://github.com/jchook/stega/blob/main/packages/cli/README.md).


Packages
--------

- [Command line utility](https://github.com/jchook/stega/blob/main/packages/cli/README.md)
- [Web browser demo](https://github.com/jchook/stega/blob/main/packages/web/README.md)
- [Core library](https://github.com/jchook/stega/blob/main/packages/core/README.md)


Use Case Examples
-----------------

- **Freedom of Speech**: Journalists or others in sensitive political environments can use steganography to hide messages within images or videos, reducing the risk of interception by oppressive regimes.

- **Secure File Sharing**: Individuals can use steganography to share sensitive documents or information by hiding them within innocuous files, reducing the likelihood of detection during transmission.

- **Data Leakage**: Corporations can embed hidden markers in sensitive documents for each recipient. If these documents are leaked, the source of the leak can be traced using the embedded information.

- **Anti-Piracy**: Software and media companies can embed unique identifiers in distributed digital content to track and trace pirated copies.

- **Privacy**: Anyone can use steganography to hide personal information, treasure maps, or sensitive data from being easily discovered or viewed.

- **Research**: Privacy and security researchers can use Stega PNG as a framework for exploring different steganographic techniques or attacks.

- **For Fun**: Steganography can make for fun challenges (think Cicada 3301), inside jokes, or similar.


If you use Stega PNG in other interesting ways, please [let us know](https://github.com/jchook/stega/issues/new). Also, please use this software ethically and for just cause.


Contributing,
------------

Feel free to [open an issue](https://github.com/jchook/stega/issues/new) or fork the repo and submit a pull request.


Roadmap
-------

- [x] Basic proof of concept (Web demo)
- [x] Factor-out portable TypeScript core
- [x] CLI tool
- [x] Monorepo
- [x] Configurable seed for LCG
- [ ] Configurable embedder class, with optional .maxLength()
- [ ] Detection mode to predict or illustrate whether data is hidden in a PNG's LSBs
- [ ] Support many embedding paradigms for different types of target documents
- [ ] Efficient rewrite in Go/Rust/etc
- [ ] GUI tool


License
-------

MIT
