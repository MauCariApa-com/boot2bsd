import { useState } from 'react';
import { BootScreen } from './components/BootScreen';
import { LoginScreen } from './components/LoginScreen';
import { Terminal } from './components/Terminal';
import { Editor } from './components/Editor';
import { useShell } from './hooks/useShell';

type Screen = 'boot' | 'login' | 'terminal' | 'editor';

export default function App() {
  const [screen, setScreen] = useState<Screen>('boot');
  const { state, execute, saveFile, login, getAutocomplete } = useShell();
  const [editingFile, setEditingFile] = useState<{ path: string[]; fileName: string; content: string } | null>(null);

  const handleEdit = (path: string[], fileName: string, content: string) => {
    setEditingFile({ path, fileName, content });
    setScreen('editor');
  };

  const handleSave = (content: string) => {
    if (editingFile) {
      saveFile(editingFile.path, editingFile.fileName, content);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-black overflow-hidden">
      {/* CRT Effects */}
      <div className="crt-overlay crt-flicker" />
      <div className="scanline" />
      
      {/* Screens */}
      {screen === 'boot' && (
        <BootScreen onComplete={() => setScreen('login')} />
      )}
      
      {screen === 'login' && (
        <LoginScreen onLogin={(user) => {
          login(user);
          setScreen('terminal');
        }} />
      )}
      
      {screen === 'terminal' && (
        <Terminal 
          state={state} 
          execute={execute} 
          onEdit={handleEdit} 
          onExit={() => setScreen('login')}
          getAutocomplete={getAutocomplete} 
        />
      )}

      {screen === 'editor' && editingFile && (
        <Editor
          fileName={editingFile.fileName}
          initialContent={editingFile.content}
          onSave={handleSave}
          onExit={() => setScreen('terminal')}
        />
      )}
    </div>
  );
}
