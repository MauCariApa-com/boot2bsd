import React, { useState, useEffect, useRef } from 'react';

interface EditorProps {
  fileName: string;
  initialContent: string;
  onSave: (content: string) => void;
  onExit: () => void;
}

export const Editor: React.FC<EditorProps> = ({ fileName, initialContent, onSave, onExit }) => {
  const [content, setContent] = useState(initialContent);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Disable common browser shortcuts
      if (
        e.key === 'Tab' ||
        (e.ctrlKey && (e.key === 'r' || e.key === 'w' || e.key === 'n' || e.key === 't' || e.key === 'f')) ||
        (e.metaKey && (e.key === 'r' || e.key === 'w' || e.key === 'n' || e.key === 't' || e.key === 'f'))
      ) {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'o') {
      e.preventDefault();
      onSave(content);
    } else if (e.ctrlKey && e.key === 'x') {
      e.preventDefault();
      onExit();
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-black text-[#00ff00] font-mono terminal-container">
      <div className="bg-[#004400] text-white px-2 py-1 flex justify-between items-center text-xs">
        <span>EDIT: {fileName}</span>
        <span>^O Save | ^X Exit</span>
      </div>
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 bg-transparent border-none outline-none p-4 resize-none text-[#00ff00] caret-[#00ff00]"
        spellCheck={false}
      />
      <div className="bg-[#004400] text-white px-2 py-1 text-[10px]">
        [ Lines: {content.split('\n').length} ]
      </div>
    </div>
  );
};
