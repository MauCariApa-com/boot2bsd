import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface LoginScreenProps {
  onLogin: (user: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<'user' | 'pass'>('user');
  const [error, setError] = useState(false);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
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
    if (e.key === 'Enter') {
      if (step === 'user') {
        const lowerUser = username.trim().toLowerCase();
        if (lowerUser === 'unixfoss' || lowerUser === 'root') {
          setStep('pass');
          setError(false);
        } else {
          setError(true);
          setUsername('');
        }
      } else {
        const lowerUser = username.trim().toLowerCase();
        const isValid = (lowerUser === 'unixfoss' && password === 'unixfoss') || 
                        (lowerUser === 'root' && (password === 'root' || password === 'unixfoss'));
        
        if (isValid) {
          onLogin(lowerUser);
        } else {
          setError(true);
          setPassword('');
          setStep('user');
          setUsername('');
        }
      }
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col items-start justify-start p-8 terminal-container">
      <div className="mb-4 text-xs opacity-50">
        Hint: login: unixfoss (pass: unixfoss) or root (pass: root)
      </div>
      <div className="mb-4">
        Boot2BSD/powerpc (boot2bsd) (ttyv0)
      </div>
      {error && (
        <div className="mb-2 text-red-500">Login incorrect</div>
      )}
      <div className="flex items-center gap-2">
        <span>login:</span>
        <div className="relative flex items-center">
          {step === 'user' ? (
            <>
              <input
                autoFocus
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
                className="absolute inset-0 bg-transparent border-none outline-none text-[#00ff00] w-full opacity-0 z-10"
              />
              <div className="flex items-baseline pointer-events-none">
                <span className="whitespace-pre">{username}</span>
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="text-[#00ff00] ml-0.5 font-bold"
                >
                  _
                </motion.span>
              </div>
            </>
          ) : (
            <span>{username}</span>
          )}
        </div>
      </div>
      {step === 'pass' && (
        <div className="flex items-center gap-2">
          <span>Password:</span>
          <div className="relative flex items-center">
            <input
              autoFocus
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              className="absolute inset-0 bg-transparent border-none outline-none text-[#00ff00] w-full opacity-0 z-10"
            />
            <div className="flex items-baseline pointer-events-none">
              <span className="whitespace-pre">{'*'.repeat(password.length)}</span>
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
      )}
    </div>
  );
};
