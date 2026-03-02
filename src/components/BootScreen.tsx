import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { BOOT_MESSAGES } from '../constants';

interface BootScreenProps {
  onComplete: () => void;
}

export const BootScreen: React.FC<BootScreenProps> = ({ onComplete }) => {
  const [visibleMessages, setVisibleMessages] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (index < BOOT_MESSAGES.length) {
      const timeout = setTimeout(() => {
        setVisibleMessages(prev => [...prev, BOOT_MESSAGES[index]]);
        setIndex(prev => prev + 1);
      }, Math.random() * 100 + 20); // Random delay for realism
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(onComplete, 1000);
      return () => clearTimeout(timeout);
    }
  }, [index, onComplete]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleMessages]);

  return (
    <div 
      ref={scrollRef}
      className="h-screen w-screen p-4 overflow-y-auto scroll-smooth terminal-container"
    >
      {visibleMessages.map((msg, i) => (
        <div key={i} className="mb-1">
          {msg}
        </div>
      ))}
      <div className="flex items-baseline">
        <span className="invisible">.</span>
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="text-[#00ff00] ml-1 font-bold"
        >
          _
        </motion.span>
      </div>
    </div>
  );
};
