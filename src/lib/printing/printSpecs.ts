export type CupType = 'standard' | 'hotzy';

export const PRINT_SPECS: Record<
  CupType,
  { widthMm: number; heightMm: number; bleedMm: number }
> = {
  standard: { widthMm: 210, heightMm: 90, bleedMm: 0 },
  hotzy: { widthMm: 210, heightMm: 90, bleedMm: 0 },
};
