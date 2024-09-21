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

For example, into PNG images, we encode secret data stochastically into the least-significant bits of the image's RGB colorspace data, making it invisible to the naked eye and difficult to detect.

In some scenarios, you may wish to combine this tool with compression,
encryption, custom codecs, etc. You can achieve this easily using the [CLI
utility](https://github.com/jchook/stega/blob/main/packages/cli/README.md) or
the [core
library](https://github.com/jchook/stega/blob/main/packages/core/README.md).


Packages
--------

- [Command line utility](https://github.com/jchook/stega/blob/main/packages/cli/README.md)
- [Web browser demo](https://github.com/jchook/stega/blob/main/packages/web/README.md)
- [Core library](https://github.com/jchook/stega/blob/main/packages/core/README.md)


Use Case Examples
-----------------

Many use cases exist for steganography today.


### Privacy

Anyone can use steganography to inconspicuously hide private or critical information such as sensitive messages, encrypted files, treasure maps, passwords, etc.

- **Freedom of Speech**: Journalists or others in sensitive political environments can reduce the risk of interception by oppressive regimes.

- **Private File Sharing**: Individuals can share sensitive documents or information by hiding them within innocuous files, reducing the likelihood of detection.

- **Private File Storage**: Those who wish to hide secrets, such as encrypted password databases or similar, can use steganography to hide important data in seemingly unimportant files.


### Invisible Watermarks

Steganography can add an invisible signature to a document.

- **Authentication**: Steganography can help verify the authenticity of a document or its source, by embedding cryptographic signatures.

- **Data Leakage**: Unique hidden markers can be embedded into sensitive documents for each recipient. If these marked documents are leaked, the source of the leak can be traced using the embedded marker.

- **Digital Rights Management**: Software and media companies can embed unique identifiers in distributed digital content to track and trace pirated copies.

- **Arbitrary Metadata**: Embed incognito data of your choosing that is difficult to forge, detect, or tamper with.


### Research

Privacy and security researchers can use Stega PNG as a framework for exploring different steganographic techniques or attacks.

- **Detect the Presence of Hidden Data**: Researchers can use the framework to rapidly produce lots of test and validation datasets for analysis, and develop systems to detect the presence of hidden data.

- **Uniformly Test New Ideas**: With a consistent core framework, researchers can test many different approaches with relatively snappy and developer-friendly ecosystem, automated tests, and reliable measurements.


### Just For Fun

Folks use steganography in challenging puzzles, inside jokes, or similar subtle communication.

- **Community Puzzles or Games**: Organizers can use steganography to augment challenges akin to Cicada 3301, geocaching, or others like Capture The Flag hacking challenges.

- **Easter-Eggs**: Images can contain special signatures that unlock secrets within AR games or other apps.


### Other

If you use Stega PNG in other interesting ways, please [let us know](https://github.com/jchook/stega/issues/new).


Safety
------

We urge all users to employ this software with ethical integrity and for purposes that align with the greater good. Please thoughtfully consider the implications of your usage and strive to contribute positively to the world we share.


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
