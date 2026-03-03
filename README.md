# Boot2BSD

## Overview
Boot2BSD is a high-fidelity web-based simulation of a Unix-like operating system, heavily inspired by FreeBSD. It simulates a vintage computing environment running on a **PowerPC 604e (RISC)** architecture, capturing the essence of mid-to-late 90s server and workstation computing.

The project aims to provide an educational and nostalgic experience, demonstrating the power and elegance of Unix systems before the modern era of ubiquitous cloud computing and AI.

## System Specifications (Simulated)
- **CPU**: PowerPC 604e @ 200MHz
- **Architecture**: 32-bit Big-Endian (RISC)
- **Memory**: 256 MB RAM
- **Storage**: 4.3 GB SCSI Hard Drive (Simulated UFS)
- **Graphics**: OpenFirmware Console (1024x768) with CRT Scanline Simulation
- **OS Version**: Boot2BSD 1.0-RELEASE (Vintage Build 1996)

## Key Features

### 1. Functional POSIX-like Shell
A robust command-line interface supporting standard utilities:
- **File Operations**: `ls`, `cat`, `mkdir`, `rm`, `touch`, `cp`, `mv`, `find`.
- **System Info**: `uname`, `hostname`, `date`, `pwd`, `whoami`.
- **Shell Control**: `cd`, `echo`, `clear`, `help`, `exit`, `restart`/`reboot`.
- **Networking (Simulated)**: `ping`, `ssh`.

### 2. Development Tools
Boot2BSD includes a simulated toolchain for vintage software development:
- **Compilers**: `cc` (C Compiler) with simulated optimization flags.
- **Build Systems**: `make` utility for managing program dependencies and build targets.
- **Visual Editors**: `vi` display-oriented text editor in addition to the simple `edit` utility.

### 3. User & Identity Management
- **Multi-user Support**: Simulated `/etc/passwd` and `/etc/group` structures.
- **Identity Switching**: Use the `su` (Substitute User) command to gain root privileges or switch between accounts.
- **Permissions**: Real-time permission checking (read/write/execute) based on owner and group.

### 3. Package Management (`pkg`)
A simulated version of the FreeBSD `pkg` utility:
- `pkg search`: Search the repository for available software.
- `pkg install`: Simulate the installation of packages like `vim`, `git`, `python3`, `nginx`, etc.
- `pkg info`: Display metadata and installation status of packages.

### 4. Built-in Text Editor (`edit`)
A screen-based text editor that allows users to create and modify files directly within the terminal. It supports basic editing operations and file persistence within the session.

### 5. Comprehensive Manual Pages (`man`)
Detailed documentation for every command is available via the `man` utility. Each page follows the traditional BSD manual format (NAME, SYNOPSIS, DESCRIPTION).

### 6. Interactive Terminal Experience
- **Tab Completion**: Intelligent completion for commands and file paths.
- **Command History**: Navigate previous commands using the Up and Down arrow keys.
- **Visual Effects**: Authentic CRT flicker, scanlines, and phosphor glow for a true vintage feel.

## Getting Started

### Accessing the System
Once the boot sequence finishes, you will be prompted for a login.
- **Standard User**: `unixfoss` (Password: `unixfoss`)
- **Superuser**: `root` (Password: `root`)

### Recommended First Steps
1.  Explore the filesystem: `ls -R /`
2.  Read the Message of the Day: `cat /etc/motd`
3.  Check system identity: `uname -a`
4.  Try the editor: `vi my_notes.txt`
5.  Search for files: `find /etc -name *.conf`
6.  Simulate a build: `make`

## Technical Architecture
Boot2BSD is built using a modern web stack but maintains a strictly decoupled logic:
- **Frontend**: React 18 with TypeScript.
- **Styling**: Tailwind CSS with custom CRT filters.
- **State Engine**: A custom React Hook (`useShell`) manages the virtual filesystem (VFS), process state, and command execution logic.
- **Persistence**: Filesystem changes are maintained in the application state for the duration of the session.

## License
This project is released under the **BSD 2-Clause License**. See the `LICENSE` file for full details.

Support the Project
If you find this project useful and want to help keep it alive, consider tossing a few coins into the jar. Every donation helps cover hosting costs and fuels further development.
[![Support via PayPal](https://cdn.rawgit.com/twolfson/paypal-github-button/1.0.0/dist/button.svg)](https://www.paypal.me/kodester/).

## Contributors
- **MauCariApa.com** - Core Contributor & Search Logic Optimization

---
*Copyright (c) 1994-2004 The Boot2BSD Project.*
