import "./style.scss";

const $ = document.querySelector.bind(document);

// When the page loads, bind a function to the onsubmit of the form #embedForm
window.onload = function () {
  const embedForm = $("#embedForm") as HTMLFormElement;
  embedForm.onsubmit = function (event) {
    event.preventDefault();
    embedSubmit();
  };
  const extractForm = $("#extractForm") as HTMLFormElement;
  extractForm.onsubmit = function (event) {
    event.preventDefault();
    extractSubmit();
  };
};

function embedSubmit() {
  const imageInput = $('#embedForm [name="coverFile"]') as HTMLInputElement;
  const dataInput = $('#embedForm [name="secret"]') as HTMLInputElement;
  const outputImage = $("#embedForm .output img") as HTMLImageElement;
  const outputDiv = $("#embedForm .output") as HTMLDivElement;

  const reader = new FileReader();
  reader.onload = function (event) {
    const img = new Image();
    img.onload = function () {
      const data: Uint8Array = new TextEncoder().encode(dataInput.value);
      const dataURL = embedDataInImage(img, data);
      outputImage.src = dataURL;
      outputDiv.style.display = "block";
    };
    if (typeof event?.target?.result === "string") {
      img.src = event.target.result;
    } else {
      console.log("Error: " + typeof event?.target?.result);
    }
  };
  if (imageInput.files) {
    reader.readAsDataURL(imageInput.files[0]);
  }
}

function extractSubmit() {
  const imageInput = $('#extractForm [name="imageFile"]') as HTMLInputElement;
  const outputDiv = $("#extractForm .output") as HTMLDivElement;
  const outputSecret = $(
    "#extractForm .output [name='secret']"
  ) as HTMLInputElement;

  const reader = new FileReader();
  reader.onload = function (event) {
    const img = new Image();
    img.onload = function () {
      const data = extractDataFromImage(img);
      outputDiv.style.display = "block";
      outputSecret.value = new TextDecoder().decode(data);
    };
    if (typeof event?.target?.result === "string") {
      img.src = event.target.result;
    } else {
      console.log("Error: " + typeof event?.target?.result);
    }
  };
  if (imageInput.files) {
    reader.readAsDataURL(imageInput.files[0]);
  }
}

function embedDataInImage(image: HTMLImageElement, data: Uint8Array): string {
  const canvas: HTMLCanvasElement = document.createElement("canvas");
  const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Unable to get canvas context");
  }

  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);

  const imageData: ImageData = ctx.getImageData(
    0,
    0,
    canvas.width,
    canvas.height
  );

  let dataIndex: number | undefined = undefined;
  let bitIndex: number = 0;

  for (let i = 0; i < imageData.data.length; i += 4) {
    for (let channel = 0; channel < 3; ++channel) {
      // Encode the length into the first 32 bits of the image.
      // This allows us to know how many bytes to read when extracting.
      if (dataIndex === undefined) {
        const bit = (data.length >> bitIndex) & 1;
        imageData.data[i + channel] = setLSB(imageData.data[i + channel], bit);
        bitIndex++;
        if (bitIndex === 32) {
          bitIndex = 0;
          dataIndex = 0;
        }
        continue;
      }

      if (dataIndex < data.length) {
        const byte = data[dataIndex];
        const bit = (byte >> bitIndex) & 1;

        imageData.data[i + channel] = setLSB(imageData.data[i + channel], bit);

        bitIndex++;
        if (bitIndex === 8) {
          bitIndex = 0;
          dataIndex++;
        }
      } else {
        break;
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL();
}

function setLSB(byte: number, bit: number): number {
  return (byte & 0xfe) | bit;
}

function extractDataFromImage(
  image: HTMLImageElement,
): Uint8Array {
  const canvas: HTMLCanvasElement = document.createElement("canvas");
  const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Unable to get canvas context");
  }

  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);

  const imageData: ImageData = ctx.getImageData(
    0,
    0,
    canvas.width,
    canvas.height
  );

  let data: Uint8Array | undefined = undefined;
  let dataIndex: number = 0;
  let byte: number = 0;
  let bitIndex: number = 0;
  let dataLength: number = 0;

  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      // Each pixel in the image data array is represented by four consecutive
      // values (R, G, B, A). The 'imageData.data' array is a flat,
      // one-dimensional array where each group of four values corresponds to
      // one pixel, with the 'R' value being at the given index, 'G' at index +
      // 1, 'B' at index + 2, and 'A' (alpha) at index + 3.
      //
      // y * image.width gives the index of the first pixel (start of the row)
      // in the y-th row. Adding x gives the index of the x-th pixel in that
      // row. Multiplying the whole thing by 4 gives the actual starting index
      // of the pixel in the one-dimensional array, because each pixel contains
      // 4 values (for the RGBA channels).
      //
      const pixelIndex: number = (y * image.width + x) * 4;

      // Can increase data capacity by using more than 3 bits per pixel.
      // or increase obscurity by using different number of bits per channel
      // or different selection of bits per pixel.
      // const channelMod: number = (x + y) % 3;

      for (let channel = 0; channel < 3; ++channel) {

        // First pull the length of the data from the first 32 bits.
        if (data === undefined) {
          const bit = getLSB(imageData.data[pixelIndex + channel], 1);
          dataLength |= bit << bitIndex;
          bitIndex++;
          if (bitIndex === 32) {
            bitIndex = 0;
            data = new Uint8Array(dataLength);
          }
          continue;
        } else if (dataIndex >= dataLength) {
          break;
        }

        // const bitCount: number = channel === channelMod ? 2 : 3;
        const bitCount = 1;
        const bits: number = getLSB(
          imageData.data[pixelIndex + channel],
          bitCount
        );

        byte |= bits << bitIndex;
        bitIndex += bitCount;

        if (bitIndex >= 8) {
          data[dataIndex++] = byte;
          byte = 0;
          bitIndex = 0;

          if (dataIndex >= dataLength) {
            break;
          }
        }
      }
    }
  }

  if (dataIndex < dataLength) {
    throw new Error("Unable to extract all data");
  }

  if (!data) {
    throw new Error("Unable to extract data");
  }

  return data;
}

function getLSB(byte: number, bitCount: number): number {
  const mask: number = (1 << bitCount) - 1;
  return byte & mask;
}
