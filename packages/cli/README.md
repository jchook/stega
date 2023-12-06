<h1 align="center">Stega PNG Command Line Utility</h1>

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


