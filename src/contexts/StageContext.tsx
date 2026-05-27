import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

export type GeologicalStage = 'surface' | 'mantle' | 'outerCore' | 'innerCore';

interface StageContextValue {
  stage: GeologicalStage;
  setStage: (stage: GeologicalStage) => void;
  prevStage: React.MutableRefObject<GeologicalStage>;
}

const StageContext = createContext<StageContextValue>({
  stage: 'surface',
  setStage: () => {},
  prevStage: { current: 'surface' },
});

export const stageColors: Record<GeologicalStage, string> = {
  surface: '#FFFFFF',
  mantle: '#0F62FE',
  outerCore: '#FE0F41',
  innerCore: '#FF5C00',
};

export const stageTextColors: Record<GeologicalStage, string> = {
  surface: '#000000',
  mantle: '#FFFFFF',
  outerCore: '#FFFFFF',
  innerCore: '#FFFFFF',
};

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

export function useStage() {
  return useContext(StageContext);
}
