# Type alias: RgbaData

Ƭ **RgbaData**: `Uint8ClampedArray` \| `Buffer`

RGBA colorspace data. A one-dimensional array containing the data in the
RGBA order, with integer values. The order goes by rows from the top-left
pixel to the bottom-right.

In a browser context, this data is obtained by calling getImageData() on a
canvas element. In a Node.js context, you can use a library such as sharp to
get the colorspace data of an image.

**`See`**

 - https://developer.mozilla.org/en-US/docs/Web/API/ImageData
 - https://sharp.pixelplumbing.com/api-colour#tocolourspace
