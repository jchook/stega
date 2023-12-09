<h1 align="center">Stega PNG Command Line Utility</h1>

<p align="center">
  <a href="https://stegapng.netlify.app/">
    <img src="https://github.com/jchook/stega/blob/main/packages/web/public/stega-nobg.png?raw=true" width="300" />
  </a>
</p>

<p align="center">
  <a href="https://github.com/jchook/stega">Stega PNG project</a> |
  <a href="https://stegapng.netlify.app/">View Demo</a>
</p>


Usage Examples
--------------

```sh
# See general usage info
stega help

# See info about a particular command
stega help embed

# Embed data.txt into target.png. Save as embedded.png.
stega embed target.png < data.txt > embedded.png

# Extract data.txt out of embedded.png
stega extract embedded.png
```


Advanced Usage Examples
-----------------------

Stega PNG is designed with the UNIX philosophy that each tool should do one
thing well. This is why it provides no native support for storing file trees,
compression, or similar.

You can easily combine stega with other tools to achieve amazing things.

```sh
# Embed many files into an image
tar cz files | stega embed target.png > embedded.png

# Extract all the files
stega extract embedded.png | tar xz
```
