import './App.css'

export default function App() {
  return (
    <form id="steg" onSubmit={(e) => { e.preventDefault(); processImage() }}>
      <input type="file" id="imageInput" accept="image/png" />
      <input type="text" id="dataInput" placeholder="Enter data to hide" />
      <button type="submit">Embed Data</button>
      <img id="outputImage" />
    </form>
  )
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

  const imageData: ImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

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


function processImage() {
  const imageInput = document.getElementById("imageInput") as HTMLInputElement;
  const dataInput = document.getElementById("dataInput") as HTMLInputElement;
  const outputImage = document.getElementById("outputImage") as HTMLImageElement;

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
    }
  };
  if (imageInput.files) {
    reader.readAsDataURL(imageInput.files[0]);
  }
}
