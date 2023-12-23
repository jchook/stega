<h1 align="center">Stega PNG Command Line Utility</h1>

<p align="center">
  <a href="https://stegapng.netlify.app/">
    <img src="https://github.com/jchook/stega/blob/main/packages/web/public/stega-nobg.png?raw=true" width="300" />
  </a>
</p>

<p align="center">
  Hide arbitrary data in an image's RGB colorspace.
</p>

<p align="center">
  <a href="https://github.com/jchook/stega">Stega PNG project</a> |
  <a href="https://stegapng.netlify.app/">View Demo</a>
</p>


Install
-------

Easily install via your favorite Node.js package manager (e.g. npm):

```sh
npm install -g @stegapng/cli
```

Simple Usage Examples
---------------------

The stega CLI tool works very simply by default. For more usage info, run `stega help`.

```sh
# Embed data into image.png
stega embed image.png < data.txt > embedded.png

# Extract data out of an image
stega extract embedded.png
```


Real-World Usage Examples
-------------------------

You can easily combine stega with other *nix tools to achieve amazing things.


### Files

Embed entire file trees, with gzip compression.

```sh
# Embed files into an image
tar cz mydir | stega embed image.png > embedded.png

# Extract all the files
stega extract embedded.png | tar xz
```

### Encryption

Securely compress and encrypt files before embedding.

```sh
# Embed data encrypted via AES (with a password)
tar cz mydir | gpg --symmetric --cipher-algo AES256 | stega embed image.png > embedded.png

# Embed data encrypted for a specific recipient (with their public key)
tar cz mydir | gpg --encrypt --recipient some@example.email | stega embed image.png > embedded.png

# Extract and decrypt the data (from either encryption scenario)
stega extract embedded.png | gpg --decrypt | tar xz
```


Contribution
------------

Please feel free to open an issue or submit a pull request.


License
-------

MIT
