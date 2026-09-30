import { useState, useEffect, useMemo } from 'react';
import type { PasswordAnalysisResult, UserContext } from '../types/analyzer';
import { analyzePassword } from '../engine/scoring';

export function usePasswordAnalyzer(initialPassword = '', initialContext?: UserContext) {
  const [password, setPassword] = useState(initialPassword);
  const [prevInitial, setPrevInitial] = useState(initialPassword);
  const [userContext, setUserContext] = useState<UserContext>(initialContext || {});

  // Adjust state during render when initialPassword changes externally
  if (initialPassword !== prevInitial) {
    setPrevInitial(initialPassword);
    setPassword(initialPassword);
  }

  // Compute analysis immediately on state change (in-memory, synchronous & fast)
  const analysis: PasswordAnalysisResult = useMemo(() => {
    return analyzePassword(password, userContext);
  }, [password, userContext]);

  // Clean memory on unmount
  useEffect(() => {
    return () => {
      setPassword('');
      setUserContext({});
    };
  }, []);

  return {
    password,
    setPassword,
    userContext,
    setUserContext,
    analysis,
  };
}
