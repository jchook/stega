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

Since PNG images use lossless compression, it is possible to store semi-secret data in the least significant bits of the image's RGB (red, green, and blue) colorspace data. Alpha (transparency) channels are ignored since using alpha LSBs would make it trivial to detect the presence of hidden data.


Bit Embedding Selection
-----------------------

We can configure exactly where secret bits are embedded in the PNG colorspace data, using the best algorithm that fits our requirements.

By default, a [linear congruential generator (LCG)](https://en.wikipedia.org/wiki/Linear_congruential_generator) allows us to very efficiently choose target pixel channels pseudorandomly on a "full cycle". This means that the available space to store data is maximized without needing to generate large arrays of shuffled indices, keep track of "used" channels, etc. It also may enable much more efficient embedding solutions in the future.


Data Encoding
=============

StegaV0
--------

Encodes a single segment of data.

1. Data type, always 0
1. Data length, always 32 bits
1. Data


StegaV1
-------

Encodes multiple segments of data, each with unlimited length.

Uses *extensible bytes* like UTF-8, to extend capacity.

1. Data type as extensible bytes
1. Data length as extensible bytes
1. Data
1. Return to step 1 unless an END sequence is reached, or type is StegaV0

Note:

- Backwards compatible with V0
- Terminated by a V0 segment
- Thinking forward to V2

