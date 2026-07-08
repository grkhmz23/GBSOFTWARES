import React, { useCallback, useRef, useState } from 'react';
import { StageContext } from './stage-context';
import type { GeologicalStage } from './stage';

export function StageProvider({ children }: { children: React.ReactNode }) {
  const [stage, setStageState] = useState<GeologicalStage>('surface');
  const prevStage = useRef<GeologicalStage>('surface');

  const setStage = useCallback((newStage: GeologicalStage) => {
    if (newStage !== stage) {
      prevStage.current = stage;
      setStageState(newStage);
    }
  }, [stage]);

  return (
    <StageContext.Provider value={{ stage, setStage, prevStage }}>
      {children}
    </StageContext.Provider>
  );
}
