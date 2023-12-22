#!/usr/bin/env node
import { createProgram } from "./program";
const program = createProgram();

async function main() {
  try {
    await program.parseAsync(process.argv);
  } catch (e) {
    if (process.env.DEBUG) {
      console.error(e);
    } else {
      if (e instanceof Error) {
        console.error(e.message);
      } else {
        console.error("An unexpected error occurred");
      }
    }
    process.exit(1);
  }
}

main();
