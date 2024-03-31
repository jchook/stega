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

Stega PNG uses [steganography](https://en.wikipedia.org/wiki/Steganography) to embed data invisibly into a digital file.

For PNGs, we encode the data stochastically into the least-significant bits of the image's RGB colorspace data, making it invisible to the naked eye and difficult to detect. Support for more document types is planned.

In some scenarios, you may wish to combine this tool with compression, encryption, and non-default bit selection. You can achieve this easily using the [CLI utility](https://github.com/jchook/stega/blob/main/packages/cli/README.md).


Packages
--------

- [Command line utility](https://github.com/jchook/stega/blob/main/packages/cli/README.md)
- [Web browser demo](https://github.com/jchook/stega/blob/main/packages/web/README.md)
- [Core library](https://github.com/jchook/stega/blob/main/packages/core/README.md)


Use Case Examples
-----------------

- **Privacy**: Anyone can use steganography to inconspicuously hide private or critical information such as sensitive messages, encrypted files, treasure maps, passwords, etc.

  - **Freedom of Speech**: Journalists or others in sensitive political environments can reduce the risk of interception by oppressive regimes.

  - **Secure File Sharing**: Individuals share sensitive documents or information by hiding them within innocuous files, reducing the likelihood of detection.

- **Invisible Watermarks**: Steganography can add an invisible metadata to a document.

  - **Data Leakage**: Corporations can embed hidden markers in sensitive documents for each recipient. If these documents are leaked, the source of the leak can be traced using the embedded information.

  - **Anti-Piracy**: Software and media companies can embed unique identifiers in distributed digital content to track and trace pirated copies.

- **Research**: Privacy and security researchers can use Stega PNG as a framework for exploring different steganographic techniques or attacks.

- **For Fun**: Folks use steganography in challenging puzzles (e.g. Cicada 3301), inside jokes, or similar subtle communication.


If you use Stega PNG in other interesting ways, please [let us know](https://github.com/jchook/stega/issues/new). Also, please use this software ethically and for just cause.


Contributing,
------------

Feel free to [open an issue](https://github.com/jchook/stega/issues/new) or fork the repo and/or submit a pull request. Please use your best manners and be respectful of others.

For code contributions, please follow existing code quality and formatting standards. Before committing, run the `pnpm run prepack` script to auto-format code, ensure tests are passing, etc. Not all pull requests will be accepted, so it's best to pitch your idea first before attempting to implement it. If you make a contribution to the core, ensure that it has 100% test coverage.


Development Roadmap
-------------------

- [x] Basic proof of concept (Web demo)
- [x] Factor-out portable TypeScript core
- [x] Configurable seed for LCG
- [x] CLI tool
- [ ] Refactor core to allow for configurable/extensible steganography codecs
- [ ] Support many embedding paradigms for different types of target documents
- [ ] Detection modes to predict or illustrate whether data is hidden in a document
- [ ] Efficient rewrite in Go/Rust/etc
- [ ] GUI tool


License
-------

MIT
