interface HasValue<T> {
  values?: T[];
  value?: T;
  parse?: (value: string) => T;
}

export interface Argument<T> extends HasValue<T> {
  name: string;
  description: string;
  required?: boolean;
};

export interface Flag {
  aliases: string[];
  description: string;
  required?: boolean;
};

export interface Option<T> extends HasValue<T>, Flag {
};

export type Options = Record<string, Option<any>>;
export type Arguments = [...Argument<any>[]];

export interface Command<TArguments extends Arguments = [], TOptions extends Options = {}> {
  action: (command: this) => void;
  options: TOptions;
  arguments: [...TArguments];
};

export function createCommandStrict<TArguments extends Arguments, TOptions extends Options>(
  commandDefinition: Command<TArguments, TOptions>
): Command<TArguments, TOptions> {
  return commandDefinition;
}

export function createDefaultAction<TArguments extends Arguments, TOptions extends Options>(): Command<TArguments, TOptions>['action'] {
  return function() {};
}

export function createCommand<TArguments extends Arguments, TOptions extends Options>(
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

