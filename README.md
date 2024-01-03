# @visbot/hfs

> A simple CAS consisting of CLI and web server.

[![License](https://img.shields.io/github/license/visbot/hfs?color=blue&style=for-the-badge)](https://github.com/visbot/hfs/blob/main/LICENSE)
[![Version](https://img.shields.io/npm/v/@visbot/hfs?style=for-the-badge)](https://www.npmjs.org/package/@visbot/hfs)
[![Build](https://img.shields.io/github/actions/workflow/status/visbot/hfs/default.yml?style=for-the-badge)](https://github.com/visbot/hfs/actions)

*This project is still in early development and not ready for production use.*

## Installation

Use your preferred [NodeJS](https://nodejs.org) package manager to install the CLI globally

```sh
$ npm install --global @visbot/hfs
```

To use the tool without installation, you can use the `npx` command:

```sh
$ npx @visbot/hfs
```

## Usage

### CLI

Once setup, you can run `hfs --help` to list available options:

```txt
Usage: hfs [options] [command]

Options:
  -h, --help                     display help for command

Commands:
  init [options] [path]          initializes the virtual file-system
  add [options] <file...>        adds one of more files to the virtual file-system
  remove|rm [options] <file...>  removes one of more file-hashes from the virtual file-system
  serve [options] [path]         serves file-hashes on the virtual file-system
  list [options] [hash...]       lists properties of a hash in the virtual file-system
  help [command]                 display help for command
```

Refer to the help for each sub-command to list its options.

## License

This project is licensed under the [MIT License](LICENSE).
