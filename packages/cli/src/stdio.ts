import { Readable } from "stream";

export function readStdinToBuffer(): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    Readable.from(process.stdin)
      .on("data", (chunk) => chunks.push(Buffer.from(chunk)))
      .on("error", (err) => reject(err))
      .on("end", () => resolve(Buffer.concat(chunks)));
  });
}

export const debug = (x: any) => {
  process.stderr.write(`${x}\n`);
  return x;
};
export const useStdin = (x: string | undefined) => !x || x === "-";
export const useStdout = (x: string | undefined) =>
  (!x && !process.stdout.isTTY) || x === "-";

