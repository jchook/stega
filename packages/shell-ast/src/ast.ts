type Argument<T> = {
  name: string;
  description: string;
  required: boolean;
  value: {
    defaultValue: T;
    parsed: T;
  };
};

type Option<T> = {
  aliases: string[];
  description: string;
  required: boolean;
  value?: T;
};

type Command<TArguments extends [...Argument<any>[]], TOptions extends Record<string, Option<any>>> = {
  action: (this: Command<TArguments, TOptions>) => void;
  options: TOptions;
  arguments: [...TArguments];
};

function createCommand<TArguments extends [...Argument<any>[]], TOptions extends Record<string, Option<any>>>(
  commandDefinition: Command<TArguments, TOptions>
): Command<TArguments, TOptions> {
  return commandDefinition;
}

const command = createCommand({
  action: function() {
    console.log(this.arguments[0].value.parsed); // Correctly typed as string
    console.log(this.arguments[1].value.parsed); // Correctly typed as number
  },
  options: {
    output: {
      aliases: ["o"],
      description: "Output file",
      required: false,
    },
  },
  arguments: [
    {
      name: "input",
      description: "Input file",
      required: true,
      value: {
        defaultValue: "-",
        parsed: "test",
      },
    },
    {
      name: "strength",
      description: "Strength",
      required: true,
      value: {
        defaultValue: 1,
        parsed: 5,
      },
    },
  ],
});


// Assuming the previous definitions of Argument, Option, and Command

function createDefaultAction<TArguments extends Argument<any>[], TOptions extends Record<string, Option<any>>>(): Command<TArguments, TOptions>['action'] {
  return function() {
    console.log('Default action executed.');
  };
}

function completeCommand<TArguments extends Argument<any>[], TOptions extends Record<string, Option<any>>>(
  partialCommand: Partial<Command<TArguments, TOptions>>
): Command<TArguments, TOptions> {
  // Provide default action if not specified
  const action = partialCommand.action ?? createDefaultAction<TArguments, TOptions>();

  // Ensure options and arguments are defined, even if empty
  const options = partialCommand.options ?? {} as TOptions;
  const argumentsArray = partialCommand.arguments ?? [] as unknown as TArguments;

  // Return the completed command
  return {
    action,
    options,
    arguments: argumentsArray,
  };
}

const completedCommand = completeCommand({
  action: function() {
    console.log(this.arguments[0].value.parsed); // Correctly typed as string
    console.log(this.arguments[1].value.parsed); // Correctly typed as number
  },
  options: {
    output: {
      aliases: ["o"],
      description: "Output file",
      required: false,
    },
  },
  arguments: [
    {
      name: "input",
      description: "Input file",
      required: true,
      value: {
        defaultValue: "-",
        parsed: "test",
      },
    },
    {
      name: "strength",
      description: "Strength",
      required: true,
      value: {
        defaultValue: 1,
        parsed: 5,
      },
    },
  ],
});

