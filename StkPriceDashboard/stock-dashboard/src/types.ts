export type StockSearchResult = {
  count: number;
  result: Array<{
    description: string;
    displaySymbol: string;
    symbol: string;
    type: string;
  }>;
};

export type CandleResponse = {
  c: number[]; // close prices
  t: number[]; // timestamps (unix seconds)
  s: string;   // status
};

export type QuoteResponse = {
  c: number; // current price
  h: number;
  l: number;
  o: number;
  pc: number; // previous close
  t: number;  // timestamp
};