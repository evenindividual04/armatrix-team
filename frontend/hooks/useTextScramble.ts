import { useState, useCallback, useRef, useEffect } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export function useTextScramble(originalText: string) {
  const [displayText, setDisplayText] = useState(originalText);
  const frameRef = useRef<number>(0);
  const iterRef = useRef(0);

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  const scramble = useCallback(() => {
    cancelAnimationFrame(frameRef.current);
    iterRef.current = 0;
    const step = () => {
      const iter = iterRef.current;
      setDisplayText(
        originalText
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' ';
            if (i < iter) return originalText[i];
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('')
      );
      iterRef.current += Math.max(0.5, originalText.length / 20);
      if (iterRef.current < originalText.length) {
        frameRef.current = requestAnimationFrame(step);
      } else {
        setDisplayText(originalText);
      }
    };
    frameRef.current = requestAnimationFrame(step);
  }, [originalText]);

  const reset = useCallback(() => {
    cancelAnimationFrame(frameRef.current);
    setDisplayText(originalText);
  }, [originalText]);

  return { displayText, scramble, reset };
}
