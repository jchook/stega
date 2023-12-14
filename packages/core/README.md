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
  <a href="https://stegapng.netlify.app/">View Demo</a>
</p>


Colorspace Encoding
-------------------

Since PNG images use lossless compression, it is possible to store invisible data in the least significant bits of the image's RGB (red, green, and blue) colorspace. Alpha (transparency) channels are ignored since using alpha LSBs would often make it trivial to detect the presence of hidden data.


Bit Embedding Selection
-----------------------

We can configure exactly where secret bits are embedded in the PNG colorspace data, using the best algorithm that fits our requirements.

By default, a [linear congruential generator (LCG)](https://en.wikipedia.org/wiki/Linear_congruential_generator) allows us to very efficiently choose target pixel channels pseudorandomly on a "full cycle". This means that each pixel channel is picked at most exactly once. Thus, the available space to store data is maximized without needing to generate large arrays of shuffled indices, keep track of "used" channels, etc.


Data Encoding Scheme
====================

StegaV0
-------

Version 1 embraces the <abbr title="Keep it simple stupid">KISS</abbr> approach. The byte-length of the supplied data is encoded into the first 4 bytes, followed by the data itself.

| Segment         | Length  | Description                                |
|-----------------|---------|--------------------------------------------|
| Data Length (L) | 4 bytes | Max 4GB, further limited by the image size |
| Data            | L bytes | Arbitrary user-supplied data               |

