import "./style.scss";

// When the page loads, bind a function to the onsubmit of the form #embedForm
window.onload = function () {
  const embedForm = document.getElementById("embedForm") as HTMLFormElement;
  embedForm.onsubmit = function (event) {
    event.preventDefault();
    processImage();
  };
};

function processImage() {
  const imageInput = document.getElementById("imageInput") as HTMLInputElement;
  const dataInput = document.getElementById("dataInput") as HTMLInputElement;
  const outputImage = document.getElementById(
    "outputImage"
  ) as HTMLImageElement;

  const reader = new FileReader();
  reader.onload = function (event) {
    const img = new Image();
    img.onload = function () {
      const data: Uint8Array = new TextEncoder().encode(dataInput.value);
      const dataURL = embedDataInImage(img, data);
      outputImage.src = dataURL;
      outputImage.style.display = "block";
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
  dataLength: number
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
      const pixelIndex: number = (y * image.width + x) * 4;
      const channelMod: number = (x + y) % 3;

      for (let channel = 0; channel < 3; ++channel) {
        const bitCount: number = channel === channelMod ? 2 : 3;
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
