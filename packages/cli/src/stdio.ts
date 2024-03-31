import * as fs from "fs";
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

interface PortableWriteStream {
  write: (data: Uint8Array) => Promise<void>;
  done: () => Promise<void>;
}

export function createStdoutWriter(): PortableWriteStream {
  return {
    write: (data) => {
      return new Promise((resolve, reject) => {
        process.stdout.write(data, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    },
    done: () => Promise.resolve(),
  };
}

export function createStreamWriter(path: string): PortableWriteStream {
  const stream = fs.createWriteStream(path);
  let hasError = false;
  let error: Error | undefined;

  // Listen for errors on the stream
  stream.on("error", (err) => {
    hasError = true;
    error = err;
  });

  return {
    write: (data) =>
      new Promise((resolve, reject) => {
        if (hasError) {
          reject(error);
          return;
        }

        // Write binary data to the stream, resolve the promise once data is
        // fully written
        const isFlushed = stream.write(data, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });

        // If the data was not flushed to the system buffer immediately, it's
        // buffered in memory You might handle backpressure here if necessary
        if (!isFlushed) {
          stream.once("drain", resolve);
        }
      }),

    done: () =>
      new Promise<void>((resolve, reject) => {
        if (hasError) {
          reject(error);
          return;
        }

        // End the stream and resolve the promise once all data has been flushed
        stream.end(() => {
          resolve();
        });
      }),
  };
}
