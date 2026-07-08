export type GeologicalStage = 'surface' | 'mantle' | 'outerCore' | 'innerCore';

export const stageColors: Record<GeologicalStage, string> = {
  surface: '#FFFFFF',
  mantle: '#0F62FE',
  outerCore: '#FE0F41',
  innerCore: '#FF5C00',
};
