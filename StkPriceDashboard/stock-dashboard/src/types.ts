export type StockSearchResult = {
  count: number;
  result: Array<{
    description: string;
    displaySymbol: string;
    symbol: string;
    type: string;
  }>;
};

export type QuoteResponse = {
  c: number; // current price
  h: number;
  l: number;
  o: number;
  pc: number; // previous close
  t: number;  // timestamp
};
export type AvWeeklyPoint = { t: number; c: number };