export interface RgbaColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface ImageData {
  data: Buffer;
  info: {
    width: number;
    height: number;
  };
}

export function rgba(
  r?: number,
  g?: number,
  b?: number,
  a?: number
): RgbaColor {
  return {
    r: r ?? 0,
    g: g ?? 0,
    b: b ?? 0,
    a: a ?? 255,
  };
}

export function drawSomething(imageData: ImageData) {
  const { width, height } = imageData.info;
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      drawPoint(
        imageData,
        x,
        y,
        rgba(
          Math.sin(x * y) * 255 % 120,
          Math.cos(x * y) * 255 % 120,
          Math.tan(x * y) * 255 % 120
        )
      );
    }
  }
}

export function drawPoint(
  imageData: ImageData,
  x: number,
  y: number,
  color: RgbaColor
) {
  const index = (y * imageData.info.width + x) * 4;
  imageData.data[index] = color.r;
  imageData.data[index + 1] = color.g;
  imageData.data[index + 2] = color.b;
  imageData.data[index + 3] = color.a;
}

export function drawLine(
  imageData: ImageData,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: RgbaColor
) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const steps = Math.max(Math.abs(dx), Math.abs(dy));
  const xIncrement = dx / steps;
  const yIncrement = dy / steps;
  let x = x1;
  let y = y1;
  for (let i = 0; i <= steps; i++) {
    drawPoint(imageData, Math.round(x), Math.round(y), color);
    x += xIncrement;
    y += yIncrement;
  }
}

export function drawCircle(
  imageData: ImageData,
  x: number,
  y: number,
  radius: number,
  color: RgbaColor
) {
  const diameter = radius * 2;
  const radiusSquared = radius * radius;
  for (let i = 0; i < diameter; i++) {
    for (let j = 0; j < diameter; j++) {
      const distanceSquared = Math.pow(i - radius, 2) + Math.pow(j - radius, 2);
      if (distanceSquared <= radiusSquared) {
        drawPoint(imageData, x + i - radius, y + j - radius, color);
      }
    }
  }
}

export function drawRectangle(
  imageData: ImageData,
  x: number,
  y: number,
  width: number,
  height: number,
  color: RgbaColor
) {
  for (let i = 0; i < width; i++) {
    drawPoint(imageData, x + i, y, color);
    drawPoint(imageData, x + i, y + height - 1, color);
  }
  for (let i = 0; i < height; i++) {
    drawPoint(imageData, x, y + i, color);
    drawPoint(imageData, x + width - 1, y + i, color);
  }
}
