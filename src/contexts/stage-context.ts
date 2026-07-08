import { createContext } from 'react';
import type React from 'react';
import type { GeologicalStage } from './stage';

export interface StageContextValue {
  stage: GeologicalStage;
  setStage: (stage: GeologicalStage) => void;
  prevStage: React.MutableRefObject<GeologicalStage>;
}

export const StageContext = createContext<StageContextValue>({
  stage: 'surface',
  setStage: () => {},
  prevStage: { current: 'surface' },
});
