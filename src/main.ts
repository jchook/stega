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
  }
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
  const outputSecret = $("#extractForm .output [name='secret']") as HTMLInputElement;

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

  let dataIndex: number = 0;
  let bitIndex: number = 0;

  for (let i = 0; i < imageData.data.length; i += 4) {
    for (let channel = 0; channel < 3; ++channel) {
      if (dataIndex < data.length) {
        const byte = data[dataIndex];
        const bit = (byte >> bitIndex) & 1;

        imageData.data[i + channel] = setLSB(imageData.data[i + channel], bit);

        bitIndex++;
        if (bitIndex === 8) {
          bitIndex = 0;
          dataIndex++;
        }
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
  dataLength: number = 64
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

  const data: Uint8Array = new Uint8Array(dataLength);
  let dataIndex: number = 0;
  let byte: number = 0;
  let bitIndex: number = 0;

  for (let y = 0; y < image.height && dataIndex < dataLength; y++) {
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
      // const channelMod: number = (x + y) % 3;

      for (let channel = 0; channel < 3; ++channel) {
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

  return data;
}

function getLSB(byte: number, bitCount: number): number {
  const mask: number = (1 << bitCount) - 1;
  return byte & mask;
}
