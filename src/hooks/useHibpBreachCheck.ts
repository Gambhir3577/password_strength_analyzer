import { useState, useEffect, useRef } from 'react';
import type { HibpBreachResult } from '../types/hibp';
import { checkPasswordBreach } from '../services/hibpService';

export function useHibpBreachCheck(password: string) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [rawResult, setRawResult] = useState<HibpBreachResult>({
    status: 'idle',
    prefix: '',
    breachCount: 0,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!isEnabled || !password) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Set loading asynchronously
    const loadingTimer = setTimeout(() => {
      setRawResult(prev => ({ ...prev, status: 'loading' }));
    }, 0);

    const timer = setTimeout(async () => {
      const res = await checkPasswordBreach(password, controller.signal);
      if (!controller.signal.aborted) {
        setRawResult(res);
      }
    }, 300); // 300ms debounce to avoid spamming the API while typing

    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(timer);
      controller.abort();
    };
  }, [password, isEnabled]);

  const result: HibpBreachResult = (!isEnabled || !password)
    ? { status: 'idle', prefix: '', breachCount: 0 }
    : rawResult;

  return {
    isEnabled,
    setIsEnabled,
    result,
  };
}
