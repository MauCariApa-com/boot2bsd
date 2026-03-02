import { FSNode } from './types';

export const BOOT_MESSAGES = [
  "Copyright (c) 1994-2004 The Boot2BSD Project.",
  "Copyright (c) 1979, 1980, 1983, 1986, 1988, 1989, 1991, 1992, 1993, 1994",
  "        The Regents of the University of California. All rights reserved.",
  "Boot2BSD is a registered trademark of The Boot2BSD Foundation.",
  "Boot2BSD 1.0-RELEASE #0: Mon Aug 19 06:12:07 UTC 1996",
  "    root@releng1.nyi.boot2bsd.org:/usr/obj/usr/src/powerpc.powerpc/sys/GENERIC powerpc",
  "Boot2BSD gcc version 2.7.2.1 (Vintage Toolchain)",
  "Console: OpenFirmware resolution 1024x768",
  "CPU: PowerPC 604e @ 200MHz (RISC Architecture)",
  "  PVR=00090202  HID0=00008000  L1 I-Cache=32KB  L1 D-Cache=32KB",
  "  Features: FPU, Altivec-ready, Superscalar Execution",
  "  Bus: 64-bit 60x Bus @ 50MHz",
  "real memory  = 268435456 (256 MB)",
  "avail memory = 241172480 (230 MB)",
  "SCSI: NCR53C810 Fast SCSI-2 Controller detected",
  "sd0: <IBM DDRS-34560 S90D> Fixed Direct Access SCSI-2 device",
  "sd0: 4357MB (8923136 512 byte sectors)",
  "le0: <AMD 79C970 PCnet-PCI Ethernet> at pci0 dev 11 function 0",
  "le0: Ethernet address 08:00:20:c0:ff:ee",
  "zsc0: <Zilog Z8530 Serial Controller> at obio0",
  "zstty0: console (9600,n,8,1)",
  "...",
  "Mounting local file systems:.",
  "Setting hostname: boot2bsd.",
  "Starting Network: le0.",
  "Starting devd.",
  "Starting cron.",
  "Starting sendmail.",
  "Starting sshd.",
  "Starting local daemons:.",
  "Updating motd:.",
  "Sun Mar  1 18:56:55 UTC 1998",
  "Boot2BSD/powerpc (boot2bsd) (ttyv0)",
];

export const MAN_PAGES: Record<string, string> = {
  ls: `LS(1)                   Boot2BSD General Commands Manual                 LS(1)

NAME
     ls -- list directory contents

SYNOPSIS
     ls [-l] [file ...]

DESCRIPTION
     For each operand that names a file of a type other than directory, ls
     displays its name as well as any requested information.  For each operand
     that names a file of type directory, ls displays the names of files con-
     tained within that directory, as well as any requested information.`,
  cd: `CD(1)                   Boot2BSD General Commands Manual                 CD(1)

NAME
     cd -- change working directory

SYNOPSIS
     cd [directory]

DESCRIPTION
     The cd utility shall change the working directory of the current shell
     execution environment.`,
  cat: `CAT(1)                  Boot2BSD General Commands Manual                CAT(1)

NAME
     cat -- concatenate and print files

SYNOPSIS
     cat [file ...]

DESCRIPTION
     The cat utility reads files sequentially, writing them to the standard
     output.`,
  edit: `EDIT(1)                 Boot2BSD General Commands Manual               EDIT(1)

NAME
     edit -- simple text editor

SYNOPSIS
     edit [file]

DESCRIPTION
     The edit utility is a simple screen-based text editor. It allows users to
     create and modify text files.`,
  man: `MAN(1)                  Boot2BSD General Commands Manual                MAN(1)

NAME
     man -- display online manual pages

SYNOPSIS
     man [command]

DESCRIPTION
     The man utility formats and displays the on-line manual pages.`,
  mkdir: `MKDIR(1)                Boot2BSD General Commands Manual              MKDIR(1)

NAME
     mkdir -- make directories

SYNOPSIS
     mkdir directory ...

DESCRIPTION
     The mkdir utility creates the directories named as operands.`,
  rm: `RM(1)                   Boot2BSD General Commands Manual                 RM(1)

NAME
     rm -- remove directory entries

SYNOPSIS
     rm [-rf] file ...

DESCRIPTION
     The rm utility attempts to remove the non-directory type files specified
     on the command line. If the -r option is specified, rm will also attempt
     to remove directories and their contents.`,
  touch: `TOUCH(1)                Boot2BSD General Commands Manual              TOUCH(1)

NAME
     touch -- change file access and modification times

SYNOPSIS
     touch file ...

DESCRIPTION
     The touch utility sets the modification and access times of files. If
     any file does not exist, it is created with default permissions.`,
  cp: `CP(1)                   Boot2BSD General Commands Manual                 CP(1)

NAME
     cp -- copy files

SYNOPSIS
     cp source_file target_file

DESCRIPTION
     The cp utility copies the contents of source_file to target_file.`,
  mv: `MV(1)                   Boot2BSD General Commands Manual                 MV(1)

NAME
     mv -- move files

SYNOPSIS
     mv source target

DESCRIPTION
     The mv utility moves the file named by the source operand to the desti-
     nation file named by the target operand.`,
  su: `SU(1)                   Boot2BSD General Commands Manual                 SU(1)

NAME
     su -- substitute user identity

SYNOPSIS
     su [user]

DESCRIPTION
     The su utility allows a user to substitute their identity for another.
     If no user is specified, root is assumed.`,
  pkg: `PKG(8)                  Boot2BSD System Manager's Manual                 PKG(8)

NAME
     pkg -- manipulate packages

SYNOPSIS
     pkg info [package]
     pkg install package
     pkg search query
     pkg update
     pkg version

DESCRIPTION
     The pkg utility is used for managing software packages. It can install,
     remove, and query information about packages from the Boot2BSD
     repository.`,
  pwd: `PWD(1)                  Boot2BSD General Commands Manual                PWD(1)

NAME
     pwd -- return working directory name

SYNOPSIS
     pwd

DESCRIPTION
     The pwd utility writes the absolute pathname of the current working
     directory to the standard output.`,
  whoami: `WHOAMI(1)               Boot2BSD General Commands Manual             WHOAMI(1)

NAME
     whoami -- display effective user id

SYNOPSIS
     whoami

DESCRIPTION
     The whoami utility displays your effective user ID as a name.`,
  hostname: `HOSTNAME(1)             Boot2BSD General Commands Manual           HOSTNAME(1)

NAME
     hostname -- set or print name of current host system

SYNOPSIS
     hostname

DESCRIPTION
     The hostname utility prints the name of the current host.`,
  date: `DATE(1)                 Boot2BSD General Commands Manual               DATE(1)

NAME
     date -- display or set date and time

SYNOPSIS
     date

DESCRIPTION
     The date utility displays the current date and time.`,
  uname: `UNAME(1)                Boot2BSD General Commands Manual              UNAME(1)

NAME
     uname -- print system information

SYNOPSIS
     uname [-anrsvmp]

DESCRIPTION
     The uname utility writes symbols representing one or more system charac-
     teristics to the standard output.`,
  echo: `ECHO(1)                 Boot2BSD General Commands Manual               ECHO(1)

NAME
     echo -- write arguments to the standard output

SYNOPSIS
     echo [string ...]

DESCRIPTION
     The echo utility writes its arguments separated by blanks and terminated
     by a newline to the standard output.`,
  clear: `CLEAR(1)                Boot2BSD General Commands Manual              CLEAR(1)

NAME
     clear -- clear the terminal screen

SYNOPSIS
     clear

DESCRIPTION
     The clear utility clears your screen if this is possible.`,
  help: `HELP(1)                 Boot2BSD General Commands Manual               HELP(1)

NAME
     help -- display available commands

SYNOPSIS
     help

DESCRIPTION
     The help utility displays a list of all available commands in the
     Boot2BSD shell.`,
  exit: `EXIT(1)                 Boot2BSD General Commands Manual               EXIT(1)

NAME
     exit -- cause the shell to exit

SYNOPSIS
     exit

DESCRIPTION
     The exit utility causes the shell to terminate and return to the login
     screen.`,
  find: `FIND(1)                 Boot2BSD General Commands Manual               FIND(1)

NAME
     find -- walk a file hierarchy

SYNOPSIS
     find [path] [-name pattern] [-type f|d]

DESCRIPTION
     The find utility recursively descends the directory tree for each path
     listed, evaluating an expression in terms of each file in the tree.`,
  restart: `RESTART(8)              Boot2BSD System Manager's Manual              RESTART(8)

NAME
     restart -- reboot the system

SYNOPSIS
     restart

DESCRIPTION
     The restart utility reboots the system. It is an alias for reboot.`,
  vi: `VI(1)                   Boot2BSD General Commands Manual                 VI(1)

NAME
     vi -- screen-oriented (visual) display editor

SYNOPSIS
     vi [file]

DESCRIPTION
     vi is a display-oriented text editor.`,
  ping: `PING(8)                 Boot2BSD System Manager's Manual                PING(8)

NAME
     ping -- send ICMP ECHO_REQUEST to network hosts

SYNOPSIS
     ping host

DESCRIPTION
     The ping utility uses the ICMP protocol's mandatory ECHO_REQUEST datagram
     to elicit an ICMP ECHO_RESPONSE from a host or gateway.`,
  ssh: `SSH(1)                  Boot2BSD General Commands Manual                 SSH(1)

NAME
     ssh -- OpenSSH SSH client (remote login program)

SYNOPSIS
     ssh [user@]hostname

DESCRIPTION
     ssh (SSH client) is a program for logging into a remote machine and for
     executing commands on a remote machine.`,
  make: `MAKE(1)                 Boot2BSD General Commands Manual                MAKE(1)

NAME
     make -- maintain program dependencies

SYNOPSIS
     make [target]

DESCRIPTION
     The make utility is a tool which controls the generation of executables
     and other non-source files of a program from the program's source files.`,
  cc: `CC(1)                   Boot2BSD General Commands Manual                  CC(1)

NAME
     cc -- C compiler

SYNOPSIS
     cc [file ...]

DESCRIPTION
     cc is the system C compiler.`,
};

export const AVAILABLE_PACKAGES = [
  { name: 'vim', version: '9.0.1677', description: 'Vi IMproved, a programmer\'s text editor' },
  { name: 'git', version: '2.41.0', description: 'Distributed revision control system' },
  { name: 'python3', version: '3.11.4', description: 'Interpreted object-oriented programming language' },
  { name: 'htop', version: '3.2.2', description: 'Interactive process viewer' },
  { name: 'curl', version: '8.1.2', description: 'Command line tool for transferring data with URLs' },
  { name: 'tmux', version: '3.3a', description: 'Terminal multiplexer' },
  { name: 'bash', version: '5.2.15', description: 'The GNU Project\'s Bourne Again SHell' },
  { name: 'nginx', version: '1.24.0', description: 'High-performance HTTP server and reverse proxy' },
];

export const INITIAL_FS: FSNode = {
  name: '/',
  type: 'directory',
  owner: 'root',
  group: 'wheel',
  permissions: 'drwxr-xr-x',
  modified: 'Mar 1 1998',
  children: [
    {
      name: 'README.md',
      type: 'file',
      owner: 'root',
      group: 'wheel',
      permissions: '-rw-r--r--',
      modified: 'Mar 2 1998',
      content: '# Boot2BSD\n\n## Overview\nBoot2BSD is a high-fidelity web-based simulation of a Unix-like operating system, heavily inspired by FreeBSD. It simulates a vintage computing environment running on a PowerPC 604e (RISC) architecture.\n\n## Key Features\n- **Functional Shell**: Standard Unix commands (ls, cd, cat, mkdir, find, ping, ssh, etc.)\n- **Development Tools**: Built-in cc compiler, make utility, and vi editor.\n- **User Management**: Multi-user support with su utility.\n- **Package Management**: Simulated pkg manager for software installation.\n- **CRT Effects**: Authentic vintage visual simulation.\n\n## Getting Started\nLogin with:\n- User: unixfoss / Pass: unixfoss\n- User: root / Pass: root\n\n## Contributors\n- MauCariApa.com\n\nUse help to see available commands or man <command> for documentation.'
    },
    {
      name: 'LICENSE',
      type: 'file',
      owner: 'root',
      group: 'wheel',
      permissions: '-rw-r--r--',
      modified: 'Mar 2 1998',
      content: 'Copyright (c) 1994-2004, Boot2BSD Project\nAll rights reserved.\n\nRedistribution and use in source and binary forms, with or without\nmodification, are permitted provided that the following conditions are met:\n\n1. Redistributions of source code must retain the above copyright notice, this\n   list of conditions and the following disclaimer.\n\n2. Redistributions in binary form must reproduce the above copyright notice,\n   this list of conditions and the following disclaimer in the documentation\n   and/or other materials provided with the distribution.\n\nTHIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"\nAND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE\nIMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE\nDISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE\nFOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL\ DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR\nSERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER\nCAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,\nOR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE\nOF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.'
    },
    {
      name: 'CHANGELOG.md',
      type: 'file',
      owner: 'root',
      group: 'wheel',
      permissions: '-rw-r--r--',
      modified: 'Mar 2 1998',
      content: '# Changelog\n\n## [1.0.0] - 1998-03-02\n\n### Added\n- Initial release of Boot2BSD simulation.\n- PowerPC 604e architecture simulation.\n- Full POSIX shell toolset.\n- Development tools: cc, make, vi.\n- Networking: ping, ssh.\n- Package manager: pkg.\n- CRT visual effects.'
    },
    {
      name: 'CONTRIBUTING.md',
      type: 'file',
      owner: 'root',
      group: 'wheel',
      permissions: '-rw-r--r--',
      modified: 'Mar 2 1998',
      content: '# Contributing to Boot2BSD\n\nThank you for your interest! We value contributions that enhance the authenticity of this PowerPC Unix simulation.\n\n## Ways to Help\n1. Report bugs in command behavior.\n2. Suggest new vintage Unix utilities.\n3. Improve manual pages (man).\n\nMaintain the mid-90s BSD spirit in all contributions!'
    },
    {
      name: 'boot',
      type: 'directory',
      owner: 'root',
      group: 'wheel',
      permissions: 'drwxr-xr-x',
      modified: 'Mar 1 1998',
      children: [
        {
          name: 'kernel',
          type: 'directory',
          owner: 'root',
          group: 'wheel',
          permissions: 'drwxr-xr-x',
          modified: 'Mar 1 1998',
          children: [
            { name: 'kernel', type: 'file', owner: 'root', group: 'wheel', permissions: '-r-xr-xr-x', modified: 'Mar 1 1998', content: 'ELF 32-bit MSB executable, PowerPC or cisco 4500, version 1 (SYSV), statically linked, not stripped' },
          ],
        },
        { name: 'loader', type: 'file', owner: 'root', group: 'wheel', permissions: '-r-xr-xr-x', modified: 'Mar 1 1998', content: 'Boot2BSD boot loader' },
        { name: 'device.hints', type: 'file', owner: 'root', group: 'wheel', permissions: '-rw-r--r--', modified: 'Mar 1 1998', content: 'hint.uart.0.at="isa"\nhint.uart.0.port="0x3F8"\nhint.uart.0.irq="4"\n' },
      ],
    },
    {
      name: 'bin',
      type: 'directory',
      owner: 'root',
      group: 'wheel',
      permissions: 'drwxr-xr-x',
      modified: 'Mar 1 1998',
      children: [
        { name: 'ls', type: 'file', owner: 'root', group: 'wheel', permissions: '-rwxr-xr-x', modified: 'Mar 1 1998', content: 'Binary file: ls' },
        { name: 'sh', type: 'file', owner: 'root', group: 'wheel', permissions: '-rwxr-xr-x', modified: 'Mar 1 1998', content: 'Binary file: sh' },
        { name: 'cat', type: 'file', owner: 'root', group: 'wheel', permissions: '-rwxr-xr-x', modified: 'Mar 1 1998', content: 'Binary file: cat' },
        { name: 'find', type: 'file', owner: 'root', group: 'wheel', permissions: '-rwxr-xr-x', modified: 'Mar 1 1998', content: 'Binary file: find' },
        { name: 'vi', type: 'file', owner: 'root', group: 'wheel', permissions: '-rwxr-xr-x', modified: 'Mar 1 1998', content: 'Binary file: vi' },
        { name: 'ping', type: 'file', owner: 'root', group: 'wheel', permissions: '-rwxr-xr-x', modified: 'Mar 1 1998', content: 'Binary file: ping' },
        { name: 'ssh', type: 'file', owner: 'root', group: 'wheel', permissions: '-rwxr-xr-x', modified: 'Mar 1 1998', content: 'Binary file: ssh' },
        { name: 'make', type: 'file', owner: 'root', group: 'wheel', permissions: '-rwxr-xr-x', modified: 'Mar 1 1998', content: 'Binary file: make' },
        { name: 'cc', type: 'file', owner: 'root', group: 'wheel', permissions: '-rwxr-xr-x', modified: 'Mar 1 1998', content: 'Binary file: cc' },
      ],
    },
    {
      name: 'etc',
      type: 'directory',
      owner: 'root',
      group: 'wheel',
      permissions: 'drwxr-xr-x',
      modified: 'Mar 1 1998',
      children: [
        { name: 'motd', type: 'file', owner: 'root', group: 'wheel', permissions: '-rw-r--r--', modified: 'Mar 1 1998', content: 'Welcome to Boot2BSD!\n\nThis is a web-based Unix simulation inspired by the FreeBSD operating system,\nrunning on simulated PowerPC 604e hardware (RISC).\n\nHistorical Context:\nIn the mid-90s, RISC architectures like PowerPC and SPARC were at the cutting\nedge of computing, offering performance that rivaled and often exceeded the\nmainstream x86 processors of the era. This simulation serves as a reminder\nthat robust, multi-user, networked computing was already highly advanced\ndecades before the modern era.\n\nKey Features:\n- POSIX-compliant shell commands (ls, cd, mkdir, rm, cp, mv, etc.)\n- Multi-user simulation with root access\n- Standard FreeBSD-style configuration files (/etc/rc.conf, etc.)\n- Built-in text editor (edit/nano)\n\nEnjoy your stay!' },
        { name: 'passwd', type: 'file', owner: 'root', group: 'wheel', permissions: '-rw-r--r--', modified: 'Mar 1 1998', content: 'root:*:0:0:Charlie &:/root:/bin/csh\nunixfoss:*:1001:1001:Unix Foss User:/home/unixfoss:/bin/sh' },
        { name: 'group', type: 'file', owner: 'root', group: 'wheel', permissions: '-rw-r--r--', modified: 'Mar 1 1998', content: 'wheel:*:0:root,unixfoss\nunixfoss:*:1001:\n' },
        { name: 'rc.conf', type: 'file', owner: 'root', group: 'wheel', permissions: '-rw-r--r--', modified: 'Mar 1 1998', content: 'hostname="boot2bsd"\nifconfig_le0="inet 192.168.1.10 netmask 255.255.255.0"\ndefaultrouter="192.168.1.1"\nsshd_enable="YES"\nsendmail_enable="NONE"\ncron_enable="YES"\n' },
        { name: 'resolv.conf', type: 'file', owner: 'root', group: 'wheel', permissions: '-rw-r--r--', modified: 'Mar 1 1998', content: 'nameserver 8.8.8.8\nnameserver 8.8.4.4\n' },
        { name: 'hosts', type: 'file', owner: 'root', group: 'wheel', permissions: '-rw-r--r--', modified: 'Mar 1 1998', content: '127.0.0.1       localhost localhost.my.domain\n::1             localhost localhost.my.domain\n127.0.0.1       boot2bsd boot2bsd.my.domain\n' },
        { name: 'fstab', type: 'file', owner: 'root', group: 'wheel', permissions: '-rw-r--r--', modified: 'Mar 1 1998', content: '# Device        Mountpoint      FStype  Options Dump    Pass#\n/dev/sd0s1a     /               ufs     rw      1       1\n/dev/sd0s1b     none            swap    sw      0       0\n' },
      ],
    },
    {
      name: 'home',
      type: 'directory',
      owner: 'root',
      group: 'wheel',
      permissions: 'drwxr-xr-x',
      modified: 'Mar 1 1998',
      children: [
        {
          name: 'unixfoss',
          type: 'directory',
          owner: 'unixfoss',
          group: 'unixfoss',
          permissions: 'drwxr-xr-x',
          modified: 'Mar 1 1998',
          children: [
            { name: '.profile', type: 'file', owner: 'unixfoss', group: 'unixfoss', permissions: '-rw-r--r--', modified: 'Mar 1 1998', content: 'PATH=/sbin:/bin:/usr/sbin:/usr/bin:/usr/local/sbin:/usr/local/bin:~/bin\nexport PATH\n' },
            { name: 'readme.txt', type: 'file', owner: 'unixfoss', group: 'unixfoss', permissions: '-rw-r--r--', modified: 'Mar 1 1998', content: 'Hello unixfoss! You are now in a Boot2BSD shell.\nTry commands like ls, cd, cat, and clear.' },
            { name: 'secret.txt', type: 'file', owner: 'unixfoss', group: 'unixfoss', permissions: '-rw-------', modified: 'Mar 1 1998', content: 'The kernel is the heart of the operating system.' },
          ],
        },
      ],
    },
    {
      name: 'root',
      type: 'directory',
      owner: 'root',
      group: 'wheel',
      permissions: 'drwx------',
      modified: 'Mar 1 1998',
      children: [
        { name: '.profile', type: 'file', owner: 'root', group: 'wheel', permissions: '-rw-r--r--', modified: 'Mar 1 1998', content: 'PATH=/sbin:/bin:/usr/sbin:/usr/bin:/usr/local/sbin:/usr/local/bin:~/bin\nexport PATH\n' },
      ],
    },
    {
      name: 'sbin',
      type: 'directory',
      owner: 'root',
      group: 'wheel',
      permissions: 'drwxr-xr-x',
      modified: 'Mar 1 1998',
      children: [
        { name: 'init', type: 'file', owner: 'root', group: 'wheel', permissions: '-rwxr-xr-x', modified: 'Mar 1 1998', content: 'Binary file: init' },
        { name: 'reboot', type: 'file', owner: 'root', group: 'wheel', permissions: '-rwxr-xr-x', modified: 'Mar 1 1998', content: 'Binary file: reboot' },
        { name: 'restart', type: 'file', owner: 'root', group: 'wheel', permissions: '-rwxr-xr-x', modified: 'Mar 1 1998', content: 'Binary file: restart' },
        { name: 'shutdown', type: 'file', owner: 'root', group: 'wheel', permissions: '-rwxr-xr-x', modified: 'Mar 1 1998', content: 'Binary file: shutdown' },
      ],
    },
    {
      name: 'usr',
      type: 'directory',
      owner: 'root',
      group: 'wheel',
      permissions: 'drwxr-xr-x',
      modified: 'Mar 1 1998',
      children: [
        {
          name: 'bin',
          type: 'directory',
          owner: 'root',
          group: 'wheel',
          permissions: 'drwxr-xr-x',
          modified: 'Mar 1 1998',
          children: [
            { name: 'grep', type: 'file', owner: 'root', group: 'wheel', permissions: '-rwxr-xr-x', modified: 'Mar 1 1998', content: 'Binary file: grep' },
            { name: 'sed', type: 'file', owner: 'root', group: 'wheel', permissions: '-rwxr-xr-x', modified: 'Mar 1 1998', content: 'Binary file: sed' },
          ],
        },
        {
          name: 'local',
          type: 'directory',
          owner: 'root',
          group: 'wheel',
          permissions: 'drwxr-xr-x',
          modified: 'Mar 1 1998',
          children: [
            { name: 'bin', type: 'directory', owner: 'root', group: 'wheel', permissions: 'drwxr-xr-x', modified: 'Mar 1 1998', children: [] },
            { name: 'sbin', type: 'directory', owner: 'root', group: 'wheel', permissions: 'drwxr-xr-x', modified: 'Mar 1 1998', children: [] },
          ],
        },
      ],
    },
    {
      name: 'tmp',
      type: 'directory',
      owner: 'root',
      group: 'wheel',
      permissions: 'drwxrwxrwt',
      modified: 'Mar 1 1998',
      children: [],
    },
    {
      name: 'dev',
      type: 'directory',
      owner: 'root',
      group: 'wheel',
      permissions: 'dr-xr-xr-x',
      modified: 'Mar 1 1998',
      children: [
        { name: 'null', type: 'file', owner: 'root', group: 'wheel', permissions: 'crw-rw-rw-', modified: 'Mar 1 1998', content: '' },
        { name: 'zero', type: 'file', owner: 'root', group: 'wheel', permissions: 'crw-rw-rw-', modified: 'Mar 1 1998', content: '' },
        { name: 'random', type: 'file', owner: 'root', group: 'wheel', permissions: 'cr--r--r--', modified: 'Mar 1 1998', content: '' },
      ],
    },
    {
      name: 'var',
      type: 'directory',
      owner: 'root',
      group: 'wheel',
      permissions: 'drwxr-xr-x',
      modified: 'Mar 1 1998',
      children: [],
    },
  ],
};
