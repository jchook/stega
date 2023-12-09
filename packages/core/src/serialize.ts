export type DataArray = Uint8Array | Uint8ClampedArray | Buffer;

/**
 * This character ends the filename data sequence.
 *
 * We choose '/' because it is disallowed on all major operating systems.
 * https://stackoverflow.com/questions/1976007/what-characters-are-forbidden-in-windows-and-linux-directory-names
 *
 * Yes '/' has an uneven bit distribution (101111), but this is offset by the
 * FILE data type byte, which has the inverse bit distribution (000001).
 */
export const FILE_NAME_END = 47; // '/'

/**
 * Which data type is being embedded.
 * This is designed to accommodate future improvements to the data structure.
 */
export enum DataSegmentType {
  RAW = 0,
  FILE = 1,
  END = 255,
}

/**
 * Many data segments can be embedded in an image.
 */
export interface DataSegment {
  type: number;
  data: DataArray;
  name?: string;
}

export function serializeDataSegments(dataSegments: DataSegment[]): Uint8ClampedArray {
  const data: Uint8ClampedArray = new Uint8ClampedArray();
  for (const dataSegment of dataSegments) {
    data.set(serializeDataSegment(dataSegment), data.length);
  }
  return data;
}

export function serializeDataSegment(dataSegment: DataSegment): Uint8ClampedArray {
  const data: number[] = [];
  data.push(dataSegment.type);
  if (dataSegment.type === DataSegmentType.FILE) {
    data.push(...serializeString(dataSegment.name || ""));
    data.push(FILE_NAME_END);
  }
  data.push(...serializeUint32(dataSegment.data.length));
  data.push(...dataSegment.data);
  return Uint8ClampedArray.from(data);
}

export function deserializeDataSegments(data: Uint8ClampedArray): DataSegment[] {
  const dataSegments: DataSegment[] = [];
  let offset = 0;
  while (offset < data.length) {
    const type = data[offset];
    offset += 1;
    let name: string | undefined;
    if (type === DataSegmentType.FILE) {
      const nameEnd = data.indexOf(FILE_NAME_END, offset);
      if (nameEnd === -1) {
        throw new Error("File name end not found");
      }
      if (nameEnd - offset > 255) {
        throw new Error("File name too long");
      }
      name = deserializeString(data.slice(offset, nameEnd));
      offset = nameEnd + 1;
    }
    const length = deserializeUint32(data.slice(offset, offset + 4));
    offset += 4;
    const segmentData = data.slice(offset, offset + length);
    offset += length;
    dataSegments.push({ type, data: segmentData, name });
  }
  return dataSegments;
}

export function serializeUint32(value: number): number[] {
  return [
    (value >> 24) & 0xff,
    (value >> 16) & 0xff,
    (value >> 8) & 0xff,
    value & 0xff,
  ];
}

export function deserializeUint32(data: Uint8ClampedArray): number {
  return (data[0] << 24) | (data[1] << 16) | (data[2] << 8) | data[3];
}

export function serializeString(value: string): Uint8Array {
    return new TextEncoder().encode(value);
}

export function deserializeString(data: Uint8ClampedArray): string {
  return new TextDecoder().decode(data);
}

