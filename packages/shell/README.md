shell
=====

Describe CLI interfaces using TypeScript.

Why
---

- Fully typed
- Abstractly describe CLI interfaces as tree-like data
- Adapt to most any backend system:
  - [commander.js]
  - [omelete]
  - [yargs]


Examples
========

Minimal
-------

A command that does nothing is perfectly valid, and should exit with 0 status.

```typescript
const program = new Command()
```

Hello World
-----------

This describes a CLI that says Hello, {name}.

```typescript
const program = new Command({
  arguments: [{
    value: {
      default: 'World',
    },
  }],
  options: {
    output: {
      aliases: ['o'],
      description: 'Output file',
    },
  },
  action: (args, opts) => {
    console.log(args[0])
  },
})
```
