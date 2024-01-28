/**
 */

interface CompletionContext {
  partial: string;
}

// Death by a thousand overloads
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html
// https://levelup.gitconnected.com/crazy-powerful-typescript-tuple-types-9b121e0a690c
type CommandArguments = [...Argument<any>[]];
type CommandOptions = Record<string, Option>;

interface Command<
  TArguments extends CommandArguments = [],
  TOptions extends CommandOptions = {},
> {
  action?: (command: this) => void | Promise<void>;
  aliases?: string[];
  arguments?: TArguments;
  description?: string;
  hidden?: boolean;
  options?: TOptions;
}

interface Argument<T = string> {
  required?: boolean;
  description?: string;
  value?: ArgumentValue<T>;
}

interface ArgumentValue<T> {
  choices?: string[];
  complete?: (value: string) => string[];
  defaultValue?: T;
  parse?: (value: string) => T;
  parsed?: T;
  required?: boolean;
}

interface Option<T = any> {
  aliases?: string[];
  description?: string;
  hidden?: boolean;
  required?: boolean;
  value?: OptionValue<T>;
}

interface OptionValue<T> extends ArgumentValue<T> {
  multiple?: boolean;
}

function createCommand<
  TArguments extends [...Argument<any>[]] = [],
  TOptions extends CommandOptions = {},
>(
  command: Command<TArguments, TOptions>
): Command<TArguments, TOptions> {
  return command
}

function args<T extends [...Argument<any>[]]>(...args: T) {
  return args;
}

const command = createCommand({
  action: (command) => { // command is "this"
    console.log(command.arguments[0].value.parsed); // Correctly typed as string
    console.log(command.arguments[1].value.parsed); // Correctly typed as number
  },
  options: {
    output: {
      aliases: ["o"],
      description: "Output file",
      required: false,
    },
  },
  // Arguments are a strictly typed tuple, not an array of a union type
  // Arguments are typed with Argument<T> where T is the type of the value / default Value
  arguments: [
    {
      description: "Input file",
      required: true,
      value: {
        defaultValue: "-",
        parsed: "test",
      },
    },
    {
      description: "strength",
      required: true,
      value: {
        defaultValue: 1,
        parsed: 5,
      },
    },
  ],
});

args()
