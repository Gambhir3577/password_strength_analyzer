import { useState, useCallback, useRef } from 'react';
import { copyToClipboardWithAutoClear } from '../services/clipboardService';

export function useClipboard(clearDelayMs = 30000) {
  const [hasCopied, setHasCopied] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(null);
  const countdownIntervalRef = useRef<number | null>(null);

  const copy = useCallback(
    async (text: string) => {
      if (!text) return false;

      // Clear existing interval
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }

      const res = await copyToClipboardWithAutoClear(text, clearDelayMs);
      if (res.success) {
        setHasCopied(true);
        setSecondsRemaining(Math.round(clearDelayMs / 1000));

        const startSeconds = Math.round(clearDelayMs / 1000);
        let remaining = startSeconds;

        countdownIntervalRef.current = window.setInterval(() => {
          remaining -= 1;
          if (remaining <= 0) {
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
            setHasCopied(false);
            setSecondsRemaining(null);
          } else {
            setSecondsRemaining(remaining);
          }
        }, 1000);

        // Hide the initial "Copied!" notification after 3s, but keep countdown running
        setTimeout(() => {
          setHasCopied(false);
        }, 3000);

        return true;
      }
      return false;
    },
    [clearDelayMs]
  );

  return {
    copy,
    hasCopied,
    secondsRemaining,
  };
}
