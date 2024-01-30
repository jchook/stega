import { describe, it, assert } from "vitest";
import { createCommand, createCommandStrict } from "./ast";

describe("createCommandStrict", () => {
  it("creates a typed command", () => {
    let called = 0;
    const command = createCommandStrict({
      action: function() {
        called += 1;
      },
      options: {
        output: {
          aliases: ["o"],
          description: "Output file",
          required: false,
          value: undefined,
        },
      },
      arguments: [
        {
          name: "input",
          description: "Input file",
          required: true,
          value: 'test',
        },
        {
          name: "strength",
          description: "Strength",
          required: true,
          value: 5,
        },
      ],
    });
    assert.equal(called, 0);
    command.action(command);
    assert.equal(called, 1);
    assert.equal(command.arguments[0].value, 'test');
    assert.equal(command.arguments[1].value, 5);
  })
})

describe('createCommand', () => {
  it('fills in the command defaults', () => {
    const command = createCommand({
    })
    assert.deepEqual(command.options, {});
    assert.deepEqual(command.arguments, []);
    assert.typeOf(command.action, 'function');
    assert.typeOf(command.action(command), 'undefined');
  })
})
