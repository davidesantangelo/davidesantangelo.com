# Davide Santangelo - Terminal Portfolio

![License](https://img.shields.io/github/license/davidesantangelo/davidesantangelo.com)

A unique, interactive terminal-based portfolio website. Explore my professional experience, skills, and projects through a fully functional command-line interface.

## Features

- **Retro Terminal Interface**: A fully functional command-line interface in the browser
- **Virtual File System**: Navigate directories with `cd`, `ls`, and `pwd` commands
- **Interactive Commands**: Type commands to explore content like a real terminal
- **Persistence**: Remembers your command history and theme settings using `localStorage`
- **Customization**: Change the terminal theme with the `theme` command (green, amber, blue, white)
- **Easter Eggs**: Hidden secrets for the curious explorer 🔍
- **Minigames**: Play `guess` (Guess the Number) and `rps` (Rock Paper Scissors)
- **Responsive**: Works on desktop and mobile

## Directory Structure

```
/
├── about/          - Bio, experience, and contacts
│   ├── bio.txt
│   ├── experience.txt
│   └── contacts.txt
├── skills/         - Programming languages and tools
│   ├── languages.txt
│   └── tools.txt
├── projects/       - Featured GitHub projects
│   └── list.txt
├── games/          - Interactive minigames
│   ├── guess
│   └── rps
└── system/         - System information (for fun)
    ├── os_info.txt
    └── logs.txt
```

## Available Commands

| Command         | Description                              |
| --------------- | ---------------------------------------- |
| `help`          | List all available commands              |
| `ls`            | List files and directories               |
| `cd [dir]`      | Change directory (supports `..` and `/`) |
| `pwd`           | Print working directory                  |
| `cat [file]`    | Read the content of a file               |
| `grep [term] [file]` | Search for a string inside a file        |
| `echo [text]`   | Display text                             |
| `clear`         | Clear the terminal screen                |
| `whoami`        | Display current user                     |
| `date`          | Show current date and time               |
| `uptime`        | Show session uptime                      |
| `neofetch`      | Display system info with ASCII art       |
| `open [url]`    | Open an external URL                     |
| `theme [color]` | Change theme (green, amber, blue, white) |
| `history`       | Show command history                     |
| `matrix`        | Enter the Matrix...                      |
| `reboot`        | Reboot the system (reload page)          |
| `reset`         | Reset terminal to factory defaults       |
| `sudo`          | Try it and discover what happens 😉      |

### Command Aliases

| Alias  | Command |
| ------ | ------- |
| `ll`   | `ls`    |
| `dir`  | `ls`    |
| `cls`  | `clear` |
| `exit` | `reboot`|
| `quit` | `reboot`|

## Easter Eggs

This terminal contains hidden features for curious explorers. Try different commands and see what you discover! 🎁

> 💡 Hint: Some commands might accept special arguments...

## Technologies

- **HTML5 & CSS3**: Terminal structure and styling (CRT effects, glowing text)
- **JavaScript (Vanilla)**: Command parser, file system logic, and interactivity
- **Fira Code**: Modern monospace font for a crisp developer experience

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
