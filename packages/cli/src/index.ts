#!/usr/bin/env node
import { createProgram } from "./program";
const program = createProgram();

async function main() {
  await program.parseAsync(process.argv);
}
main();
