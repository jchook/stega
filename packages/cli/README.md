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

The `stega` CLI tool allows you to losslessly embed data into the RGB colorspace
a PNG image and later extract it.


Simple Usage Examples
---------------------

```sh
# Print general usage info
stega help

# Embed data.txt into target.png. Write the result to embedded.png.
stega embed image.png < data.txt > embedded.png

# Extract data.txt out of embedded.png
stega extract embedded.png
```


Real-World Usage Examples
-------------------------

Stega PNG aligns with the UNIX philosophy that each tool should do one thing
well. You can easily combine stega with other tools to achieve amazing things.

```sh
# Embed files into an image
tar cz mydir | stega embed image.png > embedded.png

# Extract all the files
stega extract embedded.png | tar xz

# Embed data encrypted with AES (password)
tar cz mydir | gpg --symmetric --cipher-algo AES256 | stega embed image.png > embedded.png

# Embed data encrypted with a recipient's public key (asymmetric)
tar cz mydir | gpg --encrypt --recipient recipient_email_or_id | stega embed image.png > embedded.png

# Extract and decrypt the data (from either encryption scenario)
stega extract embedded.png | gpg --decrypt | tar xz
```


Contribution
------------

Please feel free to open an issue or submit a pull request.
