# Changelog

All notable changes to the Boot2BSD project will be documented in this file.

## [1.0.0] - 1998-03-02

### Added
- **Core System**: Initial release of Boot2BSD, a web-based Unix simulation.
- **Architecture**: Simulated PowerPC 604e (RISC) environment with Big-Endian logic.
- **Shell Utilities**: Full suite of POSIX-like commands (`ls`, `cd`, `cat`, `mkdir`, `rm`, `find`, `cp`, `mv`, etc.).
- **Development Toolchain**: Added `cc` (C Compiler), `make` (Build Utility), and `vi` (Visual Editor).
- **Networking**: Simulated `ping` and `ssh` utilities for network interaction.
- **Package Management**: Implemented `pkg` manager for simulated software installation.
- **User Management**: Multi-user support with `su`, `/etc/passwd`, and permission checking.
- **Manual Pages**: Comprehensive documentation for all commands via `man`.
- **Visuals**: Authentic CRT visual effects including scanlines, flicker, and phosphor glow.
- **Documentation**: Detailed `README.md`, `CONTRIBUTING.md`, and `LICENSE` files.

### Changed
- **Immersive Era**: Updated all system timestamps, copyright notices, and `uname` strings to reflect the 1994-2004 PowerPC prime era.
- **Shell Hook**: Enhanced command execution logic to support complex flag parsing and path resolution.

### Contributors
- **MauCariApa.com**: Core Contributor & Search Logic Optimization.

---
*Copyright (c) 1994-2004 The Boot2BSD Project.*
