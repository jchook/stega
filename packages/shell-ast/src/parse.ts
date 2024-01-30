import { Command } from "./ast";

function parseCommandLineArguments<T extends Command>(command: T, args: string[]): T {
  const finalCommand: T = {
    ...command,
    options: {
      ...command.options,
    },
    arguments: [
      ...command.arguments,
    ],
  };

  let endOfOptions = false;
  let optionName: string | undefined;
  for (const arg of args) {
    if (arg === '--') {
      endOfOptions = true;
      continue;
    } else if (!endOfOptions && (arg.startsWith('--') || arg.startsWith('-'))) {
      const name = arg.replace(/^--?/, '')
      if (name in command.options) {
        if (command.options[name].value === undefined) {
          optionName = name;
        }
        optionName = name;
      }
    }
  }

  return finalCommand
}
