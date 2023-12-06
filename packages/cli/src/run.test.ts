import { describe, it, assert } from "vitest";
import { spawn } from "child_process";
import * as path from "path";

const programPath = path.join(__dirname, "run.ts");

interface CliResult {
  out: string;
  err: string;
  code: number;
}

function run(args: string[]): Promise<CliResult> {
  return new Promise((resolve) => {
    const child = spawn("tsx", [programPath, ...args]);
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

describe("run", () => {
  it("should display help with no arguments", async () => {
    const { err, code } = await run([]);
    assert.isAbove(code, 0);
    assert.match(err, /Usage/);
  });
  it("should display help with --help", async () => {
    const { out, code } = await run(["--help"]);
    assert.equal(code, 0);
    assert.match(out, /Usage/);
  })
});
