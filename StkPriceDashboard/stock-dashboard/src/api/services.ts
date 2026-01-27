import axios from 'axios';
import type { CandleResponse, QuoteResponse } from '../types';


const STOCK_API_KEY = import.meta.env.VITE_STOCK_API_KEY;
const finnhub_url = import.meta.env.VITE_FINNHUB_URL || 'https://finnhub.io/api/v1';
const AV_KEY = import.meta.env.VITE_AV_KEY;
const AV_URL = import.meta.env.VITE_AV_URL || "https://www.alphavantage.co/query";

export const symbolSearch = async (query: string) => {
  try {
    const response = await axios.get(
      `${finnhub_url}/search`,
      {
        params: {
          q: query,
          token: STOCK_API_KEY,
          exchange: 'US',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error searching stocks:", error);
    throw error;
  }
};



export const fetchStockCandles = async (symbol: string, days = 30): Promise<CandleResponse> => {
  const to = Math.floor(Date.now() / 1000);
  const from = to - days * 24 * 60 * 60;
  console.log("API KEY:", STOCK_API_KEY);
  const response = await axios.get(`${finnhub_url}/stock/candle`, {
    params: {
      symbol,
      resolution: 'D',
      from,
      to,
      token: STOCK_API_KEY,
    },
  });
  return response.data;
};

export const fetchQuote = async (symbol: string): Promise<QuoteResponse> => {
  const { data } = await axios.get(`${finnhub_url}/quote`, {
    params: { symbol, token: STOCK_API_KEY },
  });
  return data;
};




export type AvWeeklyPoint = { t: number; c: number };

export async function fetchWeeklyCloses(symbol: string, limit = 52): Promise<AvWeeklyPoint[]> {
  const { data } = await axios.get(AV_URL, {
    params: {
      function: "TIME_SERIES_WEEKLY_ADJUSTED",
      symbol,
      apikey: AV_KEY,
    },
  });
  console.log("AV Weekly Data:", data);
  if (data["Information"]) {
    throw new Error(data["Information"]);
  }
  const series = data["Weekly Adjusted Time Series"] || {};
  const points = Object.entries(series)
    .map(([date, v]: [string, any]) => ({
      t: new Date(date).getTime(),
      c: Number(v["5. adjusted close"]),
    }))
    .sort((a, b) => a.t - b.t)
    .slice(-limit); // most recent `limit` points
  return points;
}