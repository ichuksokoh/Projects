import { useState } from "react";
import SearchBar from "./components/searchBar";
import StockCard from "./components/stockCard";
import type { StockSearchResult } from "./types";
import { fetchQuote } from "./api/services";

function App() {
  const [searchResults, setSearchResults] = useState<StockSearchResult | null>({ count: 0, result: [] });
  const [rows, setRows] = useState<Array<{ symbol: string; c: number; pc: number }>>([]);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  const handleAddSymbol = async (symbol: string) => {
    // Prevent duplicates
    if (rows.some((r) => r.symbol === symbol)) return;

    setQuoteLoading(true);
    setQuoteError(null);
    try {
      const data = await fetchQuote(symbol);
      if (!data || typeof data.c !== "number" || typeof data.pc !== "number") {
        throw new Error("No quote data");
      }
      setRows((prev) => {
        const next = [...prev, { symbol, c: data.c, pc: data.pc }];
        return next.sort((a, b) => a.symbol.localeCompare(b.symbol));
      });
    } catch (err) {
      console.error(err);
      setQuoteError("Could not load quote");
    } finally {
      setQuoteLoading(false);
    }
  };

  return (
    <div className="min-h-screen min-w-screen bg-gray-50 p-4">
      <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[calc(100vh-2rem)]">
        {/* Top-left: Price table */}
        <section
          aria-label="Stock Price Table"
          className="col-span-3 border border-gray-200 rounded-lg bg-white shadow-sm p-4 flex flex-col"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Selected Stocks</h2>
          {quoteLoading && <div className="text-gray-500">Loading…</div>}
          {quoteError && <div className="text-red-500">{quoteError}</div>}
          {rows.length === 0 && !quoteLoading && !quoteError && (
            <div className="text-gray-500">Select symbols from search to add them here.</div>
          )}
          {rows.length > 0 && (
            <div className="flex-1 overflow-y-auto">
              <table className="min-w-full text-left text-sm text-gray-800">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b">
                    <th className="py-2 px-3">Symbol</th>
                    <th className="py-2 px-3">Price</th>
                    <th className="py-2 px-3">% Change</th>
                  </tr>
                </thead>
                <tbody >
                  {rows.map((row) => {
                    const pct = ((row.c - row.pc) / Math.max(1e-9, row.pc)) * 100;
                    return (
                      <tr key={row.symbol} className="border-b">
                        <td className="py-2 px-3 font-semibold">{row.symbol}</td>
                        <td className="py-2 px-3">${row.c.toFixed(2)}</td>
                        <td className={`py-2 px-3 ${pct >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {pct.toFixed(2)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Top-right: placeholder info */}
        <section
          aria-label="Stock Price Info"
          className="col-span-1 border border-gray-200 rounded-lg bg-white shadow-sm p-4"
        >
          <h2 className="text-lg font-semibold text-gray-800">Stock Price Info</h2>
          <p className="mt-2 text-sm text-gray-500">Select symbols to add them to the table.</p>
        </section>

        {/* Bottom-right: search area */}
        <section
          aria-label="Free Space"
          className="col-span-2 border border-gray-200 rounded-lg bg-white shadow-sm p-4 flex flex-col"
        >
          <h1 className="text-black">Search</h1>
          <div className="mt-5 text-gray-400 h-3/4 w-full ">
            <SearchBar setResult={setSearchResults} />
            {searchResults && <p>Found {searchResults.count} results</p>}
            <div className="flex flex-col gap-y-1 overflow-y-auto h-3/4 w-full rounded">
              {searchResults &&
                searchResults.result.map((item, idx) => (
                  <StockCard
                    key={idx}
                    description={item.description}
                    displaySymbol={item.displaySymbol}
                    type={item.type}
                    onSelect={() => handleAddSymbol(item.symbol)}
                  />
                ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
