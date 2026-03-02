import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { CommandResponse, ShellState } from '../types';

interface TerminalProps {
  state: ShellState;
  execute: (input: string) => CommandResponse;
  onEdit: (path: string[], fileName: string, content: string) => void;
  onExit: () => void;
  getAutocomplete: (input: string) => string[];
}

export const Terminal: React.FC<TerminalProps> = ({ state, execute, onEdit, onExit, getAutocomplete }) => {
  const [history, setHistory] = useState<{ type: 'input' | 'output'; content: string; path?: string; user?: string; hostname?: string }[]>([]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('freebsd_sim_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    localStorage.setItem('freebsd_sim_history', JSON.stringify(commandHistory));
  }, [commandHistory]);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Initial MOTD
    const motd = execute('cat /etc/motd');
    setHistory([{ type: 'output', content: motd.output }]);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Disable common browser shortcuts
      if (
        e.key === 'Tab' ||
        (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'r' || e.key === 'w' || e.key === 'n' || e.key === 't' || e.key === 'f')) ||
        (e.metaKey && (e.key === 'r' || e.key === 'w' || e.key === 'n' || e.key === 't' || e.key === 'f'))
      ) {
        e.preventDefault();
      }

      // Handle Ctrl+C specifically for the shell
      if (e.ctrlKey && e.key === 'c') {
        setHistory(prev => [
          ...prev,
          { type: 'input', content: input + '^C', path: state.currentPath.join('/'), user: state.user, hostname: state.hostname },
        ]);
        setInput('');
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [input, state]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const trimmedInput = input.trim();
      if (trimmedInput) {
        setCommandHistory(prev => [trimmedInput, ...prev]);
        setHistoryIndex(-1);
      }

      const res = execute(input);
      
      if (res.action?.type === 'edit') {
        onEdit(res.action.payload!.path, res.action.payload!.fileName, res.action.payload!.content);
        setInput('');
        return;
      }

      if (res.action?.type === 'exit') {
        onExit();
        return;
      }

      if (res.output === 'CLEAR_COMMAND') {
        setHistory([]);
      } else {
        setHistory(prev => [
          ...prev,
          { type: 'input', content: input, path: state.currentPath.join('/'), user: state.user, hostname: state.hostname },
          { type: 'output', content: res.output }
        ]);
      }
      setInput('');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const suggestions = getAutocomplete(input);
      if (suggestions.length === 1) {
        const parts = input.split(/\s+/);
        parts[parts.length - 1] = suggestions[0];
        setInput(parts.join(' '));
      } else if (suggestions.length > 1) {
        setHistory(prev => [
          ...prev,
          { type: 'input', content: input, path: state.currentPath.join('/'), user: state.user, hostname: state.hostname },
          { type: 'output', content: suggestions.join('  ') }
        ]);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div 
      className="h-screen w-screen p-4 overflow-y-auto terminal-container cursor-text"
      onClick={focusInput}
      ref={terminalRef}
    >
      {history.map((item, i) => (
        <div key={i} className="mb-1 whitespace-pre-wrap">
          {item.type === 'input' ? (
            <div className="flex gap-2">
              <span className="text-blue-400">[{item.user}@{item.hostname} ~/{item.path}]{item.user === 'root' ? '#' : '$'}</span>
              <span>{item.content}</span>
            </div>
          ) : (
            <div className={item.content.includes('Command not found') ? 'text-red-400' : ''}>
              {item.content}
            </div>
          )}
        </div>
      ))}
      <div className="flex gap-2 items-center flex-wrap">
        <span className="text-blue-400">[{state.user}@{state.hostname} ~/{state.currentPath.join('/')}]{state.user === 'root' ? '#' : '$'}</span>
        <div className="relative flex-1 flex items-center">
          <input
            ref={inputRef}
            autoFocus
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="absolute inset-0 bg-transparent border-none outline-none text-[#00ff00] w-full opacity-0 z-10 cursor-text"
          />
          <div className="flex items-baseline pointer-events-none">
            <span className="whitespace-pre">{input}</span>
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="text-[#00ff00] ml-0.5 font-bold"
            >
              _
            </motion.span>
          </div>
        </div>
      </div>
    </div>
  );
};
