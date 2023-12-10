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


Data Encoding
=============

StegaV0
--------

This approach embraces the <abbr title="Keep it simple stupid">KISS</abbr>
approach, while also allowing for future extension and backwards compatibility.

| Segment         | Length  | Description                        |
|-----------------|---------|------------------------------------|
| Options         | 1 byte  | Always 0, reserved for future use  |
| Data Length (L) | 4 bytes | Max 4GB, limited by the image size |
| Data            | L bytes |                                    |

