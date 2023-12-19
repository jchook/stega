import { embedDataInImage, extractDataFromImage } from "@stegapng/core";
import "./style.scss";

const $ = document.querySelector.bind(document);

// When the page loads, bind a function to the onsubmit of the form #embedForm
window.onload = function () {
  const embedInput = $("#embedForm input[type='file']") as HTMLInputElement;
  embedInput.onchange = function () {
    embedSubmit();
  };
  const extractInput = $("#extractForm input") as HTMLInputElement;
  extractInput.onchange = function () {
    console.log("extracting");
    extractSubmit();
  };

  const downloadButton = $("#downloadButton") as HTMLButtonElement;
  downloadButton.onclick = function (event) {
    event.preventDefault();
    const outputImage = $("#embedForm .output img") as HTMLImageElement;
    const link = document.createElement("a");
    link.download = "steg.png";
    link.href = outputImage.src;
    link.click();
  };

  const shareButton = $("#shareButton") as HTMLButtonElement;
  if (!navigator.share) {
    shareButton.style.display = "none";
  }
  shareButton.onclick = async function (event) {
    event.preventDefault();
    try {
      const outputImage = $("#embedForm .output img") as HTMLImageElement;
      if (!navigator.share) {
        throw new Error("Web Share API not supported");
      }
      if (!outputImage.src) {
        throw new Error("No image to share");
      }
      const response = await fetch(outputImage.src);
      const blob = await response.blob();
      const file = new File([blob], "steg.png", {
        type: blob.type,
      });
      await navigator.share({
        files: [file],
      });
    } catch (err) {
      console.log("Error: " + err);
    }
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
      const { context, imageData } = getImageData(img);
      const data: Uint8Array = new TextEncoder().encode(dataInput.value);
      embedDataInImage(imageData.data, data);
      context.putImageData(imageData, 0, 0);
      const dataURL = context.canvas.toDataURL();
      outputImage.src = dataURL;
      outputDiv.style.display = "block";
      // Clear the input so that the onchange event fires again
      imageInput.value = "";
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
    "#extractForm .output [name='secret']",
  ) as HTMLInputElement;

  const reader = new FileReader();
  reader.onload = function (event) {
    const img = new Image();
    img.onload = function () {
      const data = extractDataFromImage(getImageData(img).imageData.data);
      outputDiv.style.display = "block";
      outputSecret.value = new TextDecoder().decode(data);
      // Clear the input so that the onchange event fires again
      imageInput.value = "";
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

function getImageData(image: HTMLImageElement): {
  context: CanvasRenderingContext2D;
  imageData: ImageData;
} {
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const context = canvas.getContext("2d");
  if (context) {
    context.drawImage(image, 0, 0);
    return {
      context,
      imageData: context.getImageData(0, 0, image.width, image.height),
    };
  } else {
    throw new Error("Could not get canvas context");
  }
}
