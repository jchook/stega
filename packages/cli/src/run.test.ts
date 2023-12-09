import { afterAll, describe, it, assert } from "vitest";
import { spawn } from "child_process";
import * as path from "path";
import * as fs from 'fs'
import * as os from 'os'

const programPath = path.join(__dirname, "run.ts");

// Get a temporary directory to work in
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "stega-test"));

// Ensure that the temporary directory is cleaned up
// after all tests have run
afterAll(() => {
  fs.rmdirSync(tmpDir, { recursive: true });
});

// Test data
const testImage = path.join(__dirname, "test.png");
const testData = path.join(__dirname, "test.txt");
const testOutput = path.join(tmpDir, "output.png");

// Get a random output file name
function randomOutputPath() {
  return path.join(tmpDir, Math.random().toString(36).substring(7) + ".png");
}

interface RunResult {
  out: string;
  err: string;
  code: number;
}

function run(cmd: string, ...args: string[]): Promise<RunResult> {
  return new Promise((resolve) => {
    const child = spawn(cmd, args);
    let out = "";
    let err = "";
    child.stdout.on("data", (data) => {
      out += data;
    });
    child.stderr.on("data", (data) => {
      err += data;
    });
    child.on("close", (code) => {
      resolve({ out, err, code: code || 0 });
    });
  });
}

function stega(...args: string[]): Promise<RunResult> {
  return run("tsx", programPath, ...args);
}

describe("run", () => {
  it("should display help with no arguments", async () => {
    const { err, code } = await stega();
    assert.isAbove(code, 0);
    assert.match(err, /Usage/);
  });
  it("should display help with --help", async () => {
    const { out, code } = await stega("--help");
    assert.equal(code, 0);
    assert.match(out, /Usage/);
  })
  it("should encode data in an image", async () => {
    const outputPath = randomOutputPath();
    const { code } = await stega("embed", testImage, testData, "-o", outputPath);
    assert.equal(code, 0);
    assert.isTrue(fs.existsSync(outputPath));
  })
  it("should decode data from an image", async () => {
    const outputPath = randomOutputPath();
    await stega("embed", testImage, testData, "-o", outputPath);
    const { out, code } = await stega("extract", testImage);
    assert.equal(code, 0);
    assert.match(out, /Hello, World!/);
  })
});
