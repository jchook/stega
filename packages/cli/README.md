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

About
-----

Hide any data in the RGB colorspace of an image.


Install
-------

Easily install via npm:

```sh
npm install -g @stegapng/cli
```

**OR**, if you prefer a packaged binary, download an [official release](#) and install it in your PATH. Don't forget to give the executable permission to run.


Simple Usage Examples
---------------------

The stega CLI tool works very simply by default.

```sh
# Embed data.txt into an image
stega embed image.png < data.txt > embedded.png

# Extract data.txt out of an image
stega extract embedded.png
```

To get usage information, run `stega help`.


Real-World Usage Examples
-------------------------

You can easily combine stega with other *nix tools to achieve amazing things.


### Files

Embed entire file trees, using gzip compression and stega shorthand.

```sh
# Embed files into an image
tar cz mydir | stega c image.png > embedded.png

# Extract all the files
stega x embedded.png | tar xz
```

### Encryption

Securely encrypt and compress files before embedding, too.

```sh
# Embed data encrypted with AES (with a password)
tar cz mydir | gpg --symmetric --cipher-algo AES256 | stega embed image.png > embedded.png

# Embed data encrypted for a specific recipient (with their public key)
tar cz mydir | gpg --encrypt --recipient some@example.email | stega embed image.png > embedded.png

# Extract and decrypt the data (from either encryption scenario)
stega extract embedded.png | gpg --decrypt | tar xz
```


Contribution
------------

Please feel free to open an issue or submit a pull request.
