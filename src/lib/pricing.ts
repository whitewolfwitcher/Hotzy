export const PRICE_CAD = {
  hotzy: 20.45,
  standard: 15.99,
} as const;

export const CAD_TO_USD = 0.74;

export type CupType = keyof typeof PRICE_CAD;
export type CurrencyCode = 'CAD' | 'USD';

export const getUnitAmount = (cupType: CupType, currency: CurrencyCode) => {
  const baseCad = PRICE_CAD[cupType] ?? PRICE_CAD.hotzy;
  const amount =
    currency === 'USD' ? Number((baseCad * CAD_TO_USD).toFixed(2)) : baseCad;
  return amount;
};
