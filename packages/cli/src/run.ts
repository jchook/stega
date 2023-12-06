import { createProgram } from "./program";
const program = createProgram();
await program.parseAsync(process.argv);
