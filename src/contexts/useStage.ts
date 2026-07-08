import { useContext } from 'react';
import { StageContext } from './stage-context';

export function useStage() {
  return useContext(StageContext);
}
