import { useState, useCallback } from 'react';
import { FSNode, ShellState, CommandResponse } from '../types';
import { INITIAL_FS, MAN_PAGES, AVAILABLE_PACKAGES } from '../constants';

export function useShell(initialUser: string = 'unixfoss') {
  const [fs, setFs] = useState<FSNode>(INITIAL_FS);
  const [state, setState] = useState<ShellState>(() => ({
    currentPath: initialUser === 'root' ? ['root'] : ['home', initialUser],
    user: initialUser,
    hostname: 'boot2bsd',
    installedPackages: ['sh', 'ls', 'cat', 'edit', 'mkdir', 'rm', 'touch', 'cp', 'mv', 'su', 'man', 'pwd', 'whoami', 'hostname', 'date', 'uname', 'echo', 'clear', 'help', 'exit', 'pkg'],
  }));

  const getDirectory = useCallback((path: string[], root: FSNode): FSNode | null => {
    let current = root;
    for (const part of path) {
      const next = current.children?.find(child => child.name === part && child.type === 'directory');
      if (!next) return null;
      current = next;
    }
    return current;
  }, []);

  const checkPermission = useCallback((node: FSNode, user: string, type: 'r' | 'w' | 'x'): boolean => {
    if (user === 'root') return true;
    const isOwner = node.owner === user;
    const perms = node.permissions;
    if (isOwner) {
      if (type === 'r') return perms[1] === 'r';
      if (type === 'w') return perms[2] === 'w';
      if (type === 'x') return perms[3] === 'x';
    } else {
      // Others
      if (type === 'r') return perms[7] === 'r';
      if (type === 'w') return perms[8] === 'w';
      if (type === 'x') return perms[9] === 'x';
    }
    return false;
  }, []);

  const saveFile = useCallback((path: string[], fileName: string, content: string) => {
    const updateFS = (node: FSNode, currentPath: string[]): FSNode => {
      if (currentPath.length === 0) {
        const existingFile = node.children?.find(c => c.name === fileName);
        if (existingFile) {
          return {
            ...node,
            children: node.children?.map(c => 
              c.name === fileName ? { ...c, content, modified: 'Mar 2 1998' } : c
            )
          };
        } else {
          return {
            ...node,
            children: [
              ...(node.children || []),
              {
                name: fileName,
                type: 'file',
                content,
                owner: state.user,
                group: state.user === 'root' ? 'wheel' : state.user,
                permissions: '-rw-r--r--',
                modified: 'Mar 2 1998'
              }
            ]
          };
        }
      }

      const [next, ...rest] = currentPath;
      return {
        ...node,
        children: node.children?.map(c => 
          c.name === next ? updateFS(c, rest) : c
        )
      };
    };

    setFs(prev => updateFS(prev, path));
  }, [state.user]);

  const resolvePathParts = useCallback((target: string): { parentPath: string[], fileName: string } => {
    let parentPath: string[] = [];
    let fileName = '';

    if (target.startsWith('/')) {
      const parts = target.split('/').filter(p => p);
      fileName = parts.pop() || '';
      parentPath = parts;
    } else if (target.includes('/')) {
      const parts = target.split('/').filter(p => p && p !== '.');
      fileName = parts.pop() || '';
      parentPath = [...state.currentPath, ...parts];
    } else {
      fileName = target;
      parentPath = state.currentPath;
    }
    return { parentPath, fileName };
  }, [state.currentPath]);

  const execute = useCallback((input: string): CommandResponse => {
    const args = input.trim().split(/\s+/);
    const command = args[0].toLowerCase();

    if (!command) return { output: '' };

    switch (command) {
      case 'ls': {
        const flags = args.filter(a => a.startsWith('-')).join('');
        const isLong = flags.includes('l');
        
        const pathArgs = args.filter(a => !a.startsWith('-')).slice(1);
        let targetPath = state.currentPath;
        
        if (pathArgs.length > 0) {
          const target = pathArgs[0];
          if (target === '/') {
            targetPath = [];
          } else if (target === '~') {
            targetPath = ['home', state.user];
          } else {
            // Very simple path resolution for now
            if (target.startsWith('/')) {
              targetPath = target.split('/').filter(p => p);
            } else {
              targetPath = [...state.currentPath, ...target.split('/').filter(p => p && p !== '.')];
            }
          }
        }

        const dir = getDirectory(targetPath, fs);
        if (!dir) return { output: `ls: ${pathArgs[0]}: No such file or directory`, error: true };
        if (dir.type === 'file') return { output: isLong ? `${dir.permissions}  1 ${dir.owner.padEnd(8)} ${dir.group.padEnd(8)} ${dir.content?.length || 0} ${dir.modified} ${dir.name}` : dir.name };
        
        if (!checkPermission(dir, state.user, 'r')) {
          return { output: `ls: ${dir.name}: Permission denied`, error: true };
        }

        if (!dir.children) return { output: '' };

        if (isLong) {
          const total = dir.children.length;
          const lines = dir.children.map(child => 
            `${child.permissions}  1 ${child.owner.padEnd(8)} ${child.group.padEnd(8)} ${String(child.type === 'directory' ? 512 : (child.content?.length || 0)).padStart(8)} ${child.modified} ${child.name}`
          );
          return { output: `total ${total}\n` + lines.join('\n') };
        }
        return { output: dir.children.map(child => child.name).join('  ') };
      }

      case 'cd': {
        const target = args[1];
        if (!target || target === '~') {
          setState(s => ({ ...s, currentPath: ['home', state.user] }));
          return { output: '' };
        }
        if (target === '/') {
          setState(s => ({ ...s, currentPath: [] }));
          return { output: '' };
        }
        if (target === '..') {
          if (state.currentPath.length === 0) return { output: '' };
          setState(s => ({ ...s, currentPath: s.currentPath.slice(0, -1) }));
          return { output: '' };
        }

        const newPath = [...state.currentPath, ...target.split('/').filter(p => p && p !== '.')];
        const dir = getDirectory(newPath, fs);
        if (dir && dir.type === 'directory') {
          if (!checkPermission(dir, state.user, 'x')) {
            return { output: `cd: ${target}: Permission denied`, error: true };
          }
          setState(s => ({ ...s, currentPath: newPath }));
          return { output: '' };
        }
        return { output: `cd: ${target}: No such file or directory`, error: true };
      }

      case 'cat': {
        const target = args[1];
        if (!target) return { output: 'usage: cat file' };
        
        const { parentPath, fileName } = resolvePathParts(target);
        const dir = getDirectory(parentPath, fs);
        const file = dir?.children?.find(child => child.name === fileName);
        
        if (file) {
          if (file.type === 'directory') return { output: `cat: ${target}: Is a directory`, error: true };
          if (!checkPermission(file, state.user, 'r')) {
            return { output: `cat: ${target}: Permission denied`, error: true };
          }
          return { output: file.content || '' };
        }
        return { output: `cat: ${target}: No such file or directory`, error: true };
      }

      case 'edit':
      case 'nano': {
        const target = args[1];
        if (!target) return { output: 'usage: edit file' };
        
        const { parentPath, fileName } = resolvePathParts(target);
        const dir = getDirectory(parentPath, fs);
        const file = dir?.children?.find(child => child.name === fileName);
        
        if (file) {
          if (file.type === 'directory') return { output: `edit: ${target}: Is a directory`, error: true };
          if (!checkPermission(file, state.user, 'w')) {
            return { output: `edit: ${target}: Permission denied`, error: true };
          }
          return { 
            output: '', 
            action: { 
              type: 'edit', 
              payload: { path: parentPath, fileName: fileName, content: file.content || '' } 
            } 
          };
        } else {
          // Create new file
          if (!dir || !checkPermission(dir, state.user, 'w')) {
            return { output: `edit: ${target}: Permission denied`, error: true };
          }
          return { 
            output: '', 
            action: { 
              type: 'edit', 
              payload: { path: parentPath, fileName: fileName, content: '' } 
            } 
          };
        }
      }

      case 'man': {
        const target = args[1];
        if (!target) return { output: 'What manual page do you want?' };
        const page = MAN_PAGES[target.toLowerCase()];
        if (page) return { output: page };
        return { output: `No manual entry for ${target}` };
      }

      case 'pkg': {
        const subCommand = args[1];
        if (!subCommand) return { output: 'usage: pkg <command> <args>\n\nCommands:\n  info      Display information about installed packages\n  install   Install a new package\n  search    Search for a package\n  update    Update package database\n  version   Display pkg version' };

        switch (subCommand) {
          case 'version':
            return { output: 'pkg v1.19.1 (Boot2BSD)' };
          case 'update':
            return { output: 'Updating Boot2BSD repository catalogue...\nBoot2BSD repository is up to date.' };
          case 'search': {
            const query = args[2];
            if (!query) return { output: 'usage: pkg search <query>' };
            const matches = AVAILABLE_PACKAGES.filter(p => p.name.includes(query) || p.description.includes(query));
            if (matches.length === 0) return { output: `No packages found matching "${query}"` };
            return { output: matches.map(p => `${p.name}-${p.version}  ${p.description}`).join('\n') };
          }
          case 'install': {
            const pkgName = args[2];
            if (!pkgName) return { output: 'usage: pkg install <package>' };
            if (state.user !== 'root') return { output: 'pkg: Insufficient privileges', error: true };
            const pkg = AVAILABLE_PACKAGES.find(p => p.name === pkgName);
            if (!pkg) return { output: `pkg: No packages available to install matching "${pkgName}"`, error: true };
            if (state.installedPackages.includes(pkgName)) return { output: `pkg: ${pkgName} is already installed` };
            
            // Simulate binary creation
            const binContent = `Binary file: ${pkgName}\nVersion: ${pkg.version}\nDescription: ${pkg.description}`;
            saveFile(['usr', 'local', 'bin'], pkgName, binContent);
            
            setState(s => ({ ...s, installedPackages: [...s.installedPackages, pkgName] }));
            return { output: `Updating Boot2BSD repository catalogue...\n[1/1] Installing ${pkgName}-${pkg.version}...\n[1/1] Extracting ${pkgName}-${pkg.version}: 100%` };
          }
          case 'info': {
            const pkgName = args[2];
            if (pkgName) {
              const pkg = AVAILABLE_PACKAGES.find(p => p.name === pkgName);
              if (!pkg || !state.installedPackages.includes(pkgName)) return { output: `pkg: No package(s) matching ${pkgName}`, error: true };
              return { output: `Name           : ${pkg.name}\nVersion        : ${pkg.version}\nDescription    : ${pkg.description}\nInstalled on   : Mon Mar 2 1998` };
            }
            return { output: state.installedPackages.filter(p => AVAILABLE_PACKAGES.some(ap => ap.name === p)).join('\n') };
          }
          default:
            return { output: `pkg: Unknown command ${subCommand}`, error: true };
        }
      }

      case 'pwd': {
        return { output: '/' + state.currentPath.join('/') };
      }

      case 'whoami': {
        return { output: state.user };
      }

      case 'hostname': {
        return { output: state.hostname };
      }

      case 'date': {
        return { output: 'Mon Mar  2 14:15:22 UTC 1998' };
      }

      case 'uname': {
        const hostname = state.hostname;
        const os = 'Boot2BSD';
        const release = '1.0-RELEASE';
        const version = 'Boot2BSD 1.0-RELEASE #0: Mon Aug 19 06:12:07 UTC 1996 root@releng1.nyi.boot2bsd.org:/usr/obj/usr/src/powerpc.powerpc/sys/GENERIC';
        const machine = 'powerpc';
        const arch = 'powerpc';

        if (args.includes('-a')) {
          return { output: `${os} ${hostname} ${release} ${version} ${machine}` };
        }
        if (args.includes('-s')) return { output: os };
        if (args.includes('-n')) return { output: hostname };
        if (args.includes('-r')) {
          // User specifically asked for "nama os, versi kernel dll" in uname -r
          return { output: `${release}-GENERIC` };
        }
        if (args.includes('-v')) return { output: version };
        if (args.includes('-m')) return { output: machine };
        if (args.includes('-p')) return { output: arch };
        
        return { output: os };
      }

      case 'echo': {
        return { output: args.slice(1).join(' ') };
      }

      case 'help': {
        return { output: 'Available commands: ls, cd, cat, edit, vi, mkdir, rm, touch, cp, mv, su, man, pwd, whoami, hostname, date, uname, echo, pkg, find, ping, ssh, make, cc, restart, clear, help, exit' };
      }

      case 'restart':
      case 'reboot': {
        if (state.user !== 'root') return { output: 'reboot: Permission denied', error: true };
        setTimeout(() => window.location.reload(), 2000);
        return { output: 'Rebooting system...\nConnection to boot2bsd closed.' };
      }

      case 'vi': {
        const target = args[1];
        if (!target) return { output: 'usage: vi file' };
        const { parentPath, fileName } = resolvePathParts(target);
        const dir = getDirectory(parentPath, fs);
        const file = dir?.children?.find(child => child.name === fileName);
        
        if (file && file.type === 'directory') return { output: `vi: ${target}: Is a directory`, error: true };
        if (file && !checkPermission(file, state.user, 'r')) return { output: `vi: ${target}: Permission denied`, error: true };

        setState(prev => ({ ...prev, isEditing: true, editingFile: target, editorContent: file?.content || '' }));
        return { output: '' };
      }

      case 'ping': {
        const host = args[1];
        if (!host) return { output: 'usage: ping host' };
        return { output: `PING ${host} (192.168.1.100): 56 data bytes\n64 bytes from 192.168.1.100: icmp_seq=0 ttl=64 time=0.123 ms\n64 bytes from 192.168.1.100: icmp_seq=1 ttl=64 time=0.145 ms\n64 bytes from 192.168.1.100: icmp_seq=2 ttl=64 time=0.112 ms\n\n--- ${host} ping statistics ---\n3 packets transmitted, 3 packets received, 0.0% packet loss\nround-trip min/avg/max/stddev = 0.112/0.126/0.145/0.014 ms` };
      }

      case 'ssh': {
        const host = args[1];
        if (!host) return { output: 'usage: ssh [user@]hostname' };
        return { output: `The authenticity of host '${host}' can't be established.\nED25519 key fingerprint is SHA256:vD/R1vE6gM4iL.\nAre you sure you want to continue connecting (yes/no)? yes\nWarning: Permanently added '${host}' (ED25519) to the list of known hosts.\nPassword for ${state.user}@${host}: \nPermission denied, please try again.` };
      }

      case 'make': {
        const target = args[1] || 'all';
        if (target === 'clean') {
          return { output: 'rm -rf *.o build/\nrm -rf bin/' };
        }
        return { output: `cc -O2 -pipe -mcpu=604e -c main.c -o main.o\ncc -O2 -pipe -mcpu=604e -c utils.c -o utils.o\ncc -O2 -pipe -mcpu=604e main.o utils.o -o boot2bsd\nBuild successful.` };
      }

      case 'cc': {
        if (args.length === 1) return { output: 'cc: no input files' };
        return { output: 'cc: warning: optimization level -O2 enabled by default\nCompilation finished.' };
      }

      case 'find': {
        const startPathArg = args[1] && !args[1].startsWith('-') ? args[1] : '.';
        
        let namePattern: string | null = null;
        let typeFilter: string | null = null;
        
        for (let i = 1; i < args.length; i++) {
          if (args[i] === '-name' && i + 1 < args.length) {
            namePattern = args[i + 1];
            i++;
          } else if (args[i] === '-type' && i + 1 < args.length) {
            typeFilter = args[i + 1];
            i++;
          }
        }

        let pathParts: string[] = [];
        if (startPathArg === '/') {
          pathParts = [];
        } else if (startPathArg === '.') {
          pathParts = state.currentPath;
        } else if (startPathArg.startsWith('/')) {
          pathParts = startPathArg.split('/').filter(p => p);
        } else {
          pathParts = [...state.currentPath, ...startPathArg.split('/').filter(p => p)];
        }

        const normalizedPath: string[] = [];
        for (const p of pathParts) {
          if (p === '..') normalizedPath.pop();
          else if (p !== '.') normalizedPath.push(p);
        }

        const startNode = getDirectory(normalizedPath, fs);
        if (!startNode) return { output: `find: ${startPathArg}: No such file or directory`, error: true };

        const results: string[] = [];
        
        const walk = (node: FSNode, currentPathParts: string[]) => {
          const fullPath = '/' + currentPathParts.join('/');
          
          let match = true;
          if (namePattern) {
            const regexStr = '^' + namePattern.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$';
            const regex = new RegExp(regexStr);
            if (!regex.test(node.name)) match = false;
          }
          if (typeFilter) {
            if (typeFilter === 'f' && node.type !== 'file') match = false;
            if (typeFilter === 'd' && node.type !== 'directory') match = false;
          }

          if (match) results.push(fullPath);

          if (node.type === 'directory' && node.children) {
            node.children.forEach(child => walk(child, [...currentPathParts, child.name]));
          }
        };

        walk(startNode, normalizedPath);
        return { output: results.join('\n') };
      }

      case 'mkdir': {
        const target = args[1];
        if (!target) return { output: 'usage: mkdir directory' };
        const { parentPath, fileName: dirName } = resolvePathParts(target);
        
        const parent = getDirectory(parentPath, fs);
        if (!parent) return { output: `mkdir: ${target}: No such file or directory`, error: true };
        if (!checkPermission(parent, state.user, 'w')) return { output: `mkdir: ${target}: Permission denied`, error: true };
        if (parent.children?.find(c => c.name === dirName)) return { output: `mkdir: ${dirName}: File exists`, error: true };

        const newNode: FSNode = {
          name: dirName!,
          type: 'directory',
          owner: state.user,
          group: state.user === 'root' ? 'wheel' : state.user,
          permissions: 'drwxr-xr-x',
          modified: 'Mar 2 1998',
          children: []
        };

        const updateFS = (node: FSNode, currentPath: string[]): FSNode => {
          if (currentPath.length === 0) {
            return { ...node, children: [...(node.children || []), newNode] };
          }
          const [next, ...rest] = currentPath;
          return {
            ...node,
            children: node.children?.map(c => c.name === next ? updateFS(c, rest) : c)
          };
        };

        setFs(prev => updateFS(prev, parentPath));
        return { output: '' };
      }

      case 'touch': {
        const target = args[1];
        if (!target) return { output: 'usage: touch file' };
        const { parentPath, fileName } = resolvePathParts(target);
        const dir = getDirectory(parentPath, fs);
        const file = dir?.children?.find(child => child.name === fileName);
        
        if (file) {
          const updateFS = (node: FSNode, currentPath: string[]): FSNode => {
            if (currentPath.length === 0) {
              return {
                ...node,
                children: node.children?.map(c => 
                  c.name === fileName ? { ...c, modified: 'Mar 2 1998' } : c
                )
              };
            }
            const [next, ...rest] = currentPath;
            return { ...node, children: node.children?.map(c => c.name === next ? updateFS(c, rest) : c) };
          };
          setFs(prev => updateFS(prev, parentPath));
          return { output: '' };
        } else {
          saveFile(parentPath, fileName, '');
          return { output: '' };
        }
      }

      case 'rm': {
        const target = args[1];
        if (!target) return { output: 'usage: rm file' };
        const recursive = args.includes('-r') || args.includes('-rf');
        const { parentPath, fileName } = resolvePathParts(target);
        const dir = getDirectory(parentPath, fs);
        const node = dir?.children?.find(child => child.name === fileName);

        if (!node) return { output: `rm: ${target}: No such file or directory`, error: true };
        if (node.type === 'directory' && !recursive) return { output: `rm: ${target}: is a directory`, error: true };
        if (!checkPermission(dir!, state.user, 'w')) return { output: `rm: ${target}: Permission denied`, error: true };

        const updateFS = (node: FSNode, currentPath: string[]): FSNode => {
          if (currentPath.length === 0) {
            return { ...node, children: node.children?.filter(c => c.name !== fileName) };
          }
          const [next, ...rest] = currentPath;
          return { ...node, children: node.children?.map(c => c.name === next ? updateFS(c, rest) : c) };
        };

        setFs(prev => updateFS(prev, parentPath));
        return { output: '' };
      }

      case 'cp': {
        const src = args[1];
        const dest = args[2];
        if (!src || !dest) return { output: 'usage: cp source_file target_file' };
        
        const { parentPath: srcParent, fileName: srcFile } = resolvePathParts(src);
        const { parentPath: destParent, fileName: destFile } = resolvePathParts(dest);

        const dir = getDirectory(srcParent, fs);
        const srcNode = dir?.children?.find(child => child.name === srcFile);
        if (!srcNode) return { output: `cp: ${src}: No such file or directory`, error: true };
        if (srcNode.type === 'directory') return { output: `cp: ${src}: is a directory (recursive copy not implemented)`, error: true };

        saveFile(destParent, destFile, srcNode.content || '');
        return { output: '' };
      }

      case 'mv': {
        const src = args[1];
        const dest = args[2];
        if (!src || !dest) return { output: 'usage: mv source target' };

        const { parentPath: srcParent, fileName: srcFile } = resolvePathParts(src);
        const { parentPath: destParent, fileName: destFile } = resolvePathParts(dest);

        const dir = getDirectory(srcParent, fs);
        const srcNode = dir?.children?.find(child => child.name === srcFile);
        if (!srcNode) return { output: `mv: ${src}: No such file or directory`, error: true };

        const updateFS = (node: FSNode, currentPath: string[]): FSNode => {
          if (currentPath.length === 0) {
            const newNode = { ...srcNode, name: destFile };
            return { ...node, children: [...(node.children?.filter(c => c.name !== srcFile) || []), newNode] };
          }
          const [next, ...rest] = currentPath;
          return { ...node, children: node.children?.map(c => c.name === next ? updateFS(c, rest) : c) };
        };

        // This is a bit complex because src and dest might be in different directories.
        // For simplicity in this simulation, we'll only support mv within the same directory or simple rename.
        // If they are different, we'll just do a copy and delete.
        if (JSON.stringify(srcParent) === JSON.stringify(destParent)) {
          setFs(prev => updateFS(prev, srcParent));
        } else {
          saveFile(destParent, destFile, srcNode.content || '');
          const deleteFromSrc = (node: FSNode, currentPath: string[]): FSNode => {
            if (currentPath.length === 0) {
              return { ...node, children: node.children?.filter(c => c.name !== srcFile) };
            }
            const [next, ...rest] = currentPath;
            return { ...node, children: node.children?.map(c => c.name === next ? deleteFromSrc(c, rest) : c) };
          };
          setFs(prev => deleteFromSrc(prev, srcParent));
        }
        
        return { output: '' };
      }

      case 'su': {
        const targetUser = args[1] || 'root';
        if (targetUser === state.user) return { output: '' };
        // Simple simulation: no password check for su in this demo
        setState(s => ({
          ...s,
          user: targetUser,
          currentPath: targetUser === 'root' ? ['root'] : ['home', targetUser]
        }));
        return { output: `Logged in as ${targetUser}` };
      }

      case 'exit': {
        return { output: 'logout', action: { type: 'exit' } };
      }

      case 'clear': {
        return { output: 'CLEAR_COMMAND' };
      }

      default:
        return { output: `${command}: Command not found.`, error: true };
    }
  }, [fs, state, getDirectory, checkPermission]);

  const login = useCallback((user: string) => {
    setState({
      user,
      hostname: 'boot2bsd',
      currentPath: user === 'root' ? ['root'] : ['home', user],
      installedPackages: ['sh', 'ls', 'cat', 'edit', 'mkdir', 'rm', 'touch', 'cp', 'mv', 'su', 'man', 'pwd', 'whoami', 'hostname', 'date', 'uname', 'echo', 'clear', 'help', 'exit', 'pkg'],
    });
  }, []);

  const getAutocomplete = useCallback((input: string): string[] => {
    const parts = input.split(/\s+/);
    const lastPart = parts[parts.length - 1];
    
    if (parts.length === 1) {
      // Autocomplete command
      return state.installedPackages.filter(cmd => cmd.startsWith(lastPart));
    } else {
      // Autocomplete path
      const { parentPath, fileName } = resolvePathParts(lastPart);
      const dir = getDirectory(parentPath, fs);
      if (!dir || !dir.children) return [];
      
      return dir.children
        .filter(child => child.name.startsWith(fileName))
        .map(child => {
          // If it's a directory, add a slash
          const suffix = child.type === 'directory' ? '/' : '';
          
          // Reconstruct the path
          const pathParts = lastPart.split('/');
          pathParts[pathParts.length - 1] = child.name + suffix;
          return pathParts.join('/');
        });
    }
  }, [state.installedPackages, state.currentPath, fs, getDirectory, resolvePathParts]);

  return { state, execute, saveFile, login, getAutocomplete };
}
