import { useEffect, useState } from "react";
import SearchBar from "./components/searchBar";
import StockCard from "./components/stockCard";
import type { StockSearchResult } from "./types";
import { fetchQuote, fetchWeeklyCloses } from "./api/services";
import Graph from "./components/grpah";

function App() {
  const [searchResults, setSearchResults] = useState<StockSearchResult | null>({ count: 0, result: [] });
  const [rows, setRows] = useState<Array<{ symbol: string; c: number; pc: number; description: string }>>([]);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [CompsInTable, setCompsInTable] = useState<Set<string>>(new Set());

  const [chartSymbol, setChartSymbol] = useState<string | null>(null);
  const [graphData, setgraphData] = useState<Array<{ t: number; c: number }>>([]);
  const [graphLoading, setgraphLoading] = useState(false);
  const [graphError, setgraphError] = useState<string | null>(null);

  const [viewportW, setViewportW] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 1024);

  useEffect(() => {
    const onResize = () => setViewportW(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!chartSymbol) return;
    (async () => {
      setgraphLoading(true);
      setgraphError(null);
      try {
        const data = await fetchWeeklyCloses(chartSymbol, 52);
        setgraphData(data);
      } catch (err) {
        console.error(err);
        if (err instanceof Error) {
          const msg = err.message;
          console.log(msg);
          if (msg.toLowerCase().includes("25 requests per day")) {
            setgraphError("Daily Limit reached for chart data");
          }
          else {
            setgraphError("Could not load chart data");
          }
        }
        setgraphData([]);
      } finally {
        setgraphLoading(false);
      }
    })();
  }, [chartSymbol]);

  const handleAddSymbol = async (symbol: string, description: string) => {
    // Prevent duplicates
    if (rows.some((r) => r.symbol === symbol)) {
      setChartSymbol(symbol);
      return;
    }

    setQuoteLoading(true);
    setQuoteError(null);
    try {
      const data = await fetchQuote(symbol);
      if (!data || typeof data.c !== "number" || typeof data.pc !== "number") {
        throw new Error("No quote data");
      }
      setRows((prev) => {
        const next = [...prev, { symbol, c: data.c, pc: data.pc, description }];
        setCompsInTable((prevSet) => new Set(prevSet).add(symbol + description.toLowerCase()));
        return next.sort((a, b) => a.symbol.localeCompare(b.symbol));
      });
      setChartSymbol(symbol);
    } catch (err) {
      console.error(err);
      setQuoteError("Could not load quote");
    } finally {
      setQuoteLoading(false);
    }
  };

  const handleRemoveSymbol = (symbol: string, description: string) => {
    if (!CompsInTable.has(symbol + description.toLowerCase())) return;
    setCompsInTable((prev) => {
      const next = new Set(prev);
      next.delete(symbol + description.toLowerCase());
      return next;
    });
    setRows((prev) => prev.filter((r) => r.symbol !== symbol || r.description !== description));
    if (chartSymbol === symbol) {
      setChartSymbol(null);
      setgraphData([]);
    }
  };

  // const renderLine = () => {
  //   if (!graphData.length) return null;
  //   const isNarrow = viewportW < 640;

  //   const prices = graphData.map((p) => p.c);
  //   const times = graphData.map((p) => p.t);
  //   const minC = Math.min(...prices);
  //   const maxC = Math.max(...prices);
  //   const minT = Math.min(...times);
  //   const maxT = Math.max(...times);

  //   // Layout
  //   const w = 1100; // viewBox width (stays fixed; scales via viewBox)
  //   const h = 350;  // viewBox height (stays fixed; scales via viewBox)
  //   const margin = {
  //     top: 12,
  //     right: 12,
  //     bottom: isNarrow ? 36 : 48,
  //     left: isNarrow ? 48 : 64,
  //   };
  //   const innerW = w - margin.left - margin.right;
  //   const innerH = h - margin.top - margin.bottom;
  //   const fontTick = isNarrow ? 8 : 10;
  //   const fontAxis = isNarrow ? 9 : 11;

  //   const xScale = (t: number) =>
  //     margin.left + ((t - minT) / Math.max(1, maxT - minT)) * innerW;
  //   const yScale = (c: number) =>
  //     margin.top + innerH - ((c - minC) / Math.max(1e-9, maxC - minC)) * innerH;

  //   const points = graphData.map((p) => `${xScale(p.t)},${yScale(p.c)}`);

  //   // Y ticks (5)
  //   const yTicks = Array.from({ length: 7 }, (_, i) => minC + ((maxC - minC) * i) / 6);
  //   // X ticks (up to 6 evenly spread)
  //   const xTicks = Array.from({ length: Math.min(6, graphData.length) }, (_, i) => {
  //     const idx = Math.round((i / Math.max(1, Math.min(5, graphData.length - 1))) * (graphData.length - 1));
  //     return graphData[idx]?.t;
  //   }).filter((v, i, arr) => v != null && arr.indexOf(v) === i);

  //   const fmtDate = (t: number) => {
  //     const d = new Date(t);
  //     return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear().toString().slice(-2)}`;
  //   };

  //   return (
  //     <svg
  //       width="100%"
  //       height="auto"
  //       viewBox={`0 0 ${w} ${h}`}
  //       preserveAspectRatio="xMidYMid meet"
  //       className="w-full h-auto max-h-[220px] sm:max-h-[280px] md:max-h-[360px]"
  //     >
  //       {/* Grid lines */}
  //       {yTicks.map((y, i) => (
  //         <line
  //           key={`ygrid-${i}`}
  //           x1={margin.left}
  //           x2={margin.left + innerW}
  //           y1={yScale(y)}
  //           y2={yScale(y)}
  //           stroke="#e5e7eb"
  //           strokeWidth="1"
  //         />
  //       ))}
  //       {xTicks.map((t, i) => (
  //         <line
  //           key={`xgrid-${i}`}
  //           x1={xScale(t!)}
  //           x2={xScale(t!)}
  //           y1={margin.top}
  //           y2={margin.top + innerH}
  //           stroke="#e5e7eb"
  //           strokeWidth="1"
  //         />
  //       ))}

  //       {/* Axes */}
  //       <line
  //         x1={margin.left}
  //         x2={margin.left}
  //         y1={margin.top}
  //         y2={margin.top + innerH}
  //         stroke="#111827"
  //         strokeWidth="1.5"
  //       />
  //       <line
  //         x1={margin.left}
  //         x2={margin.left + innerW}
  //         y1={margin.top + innerH}
  //         y2={margin.top + innerH}
  //         stroke="#111827"
  //         strokeWidth="1.5"
  //       />

  //       {/* Tick labels Y */}
  //       {yTicks.map((y, i) => (
  //         <text
  //           key={`ylabel-${i}`}
  //           x={margin.left - 8}
  //           y={yScale(y) + 4}
  //           textAnchor="end"
  //           fontSize={fontTick}
  //           fill="#374151"
  //         >
  //           {y.toFixed(2)}
  //         </text>
  //       ))}

  //       {/* Tick labels X */}
  //       {xTicks.map((t, i) => (
  //         <text
  //           key={`xlabel-${i}`}
  //           x={xScale(t!)}
  //           y={margin.top + innerH + 16}
  //           textAnchor="middle"
  //           fontSize={fontTick}
  //           fill="#374151"
  //         >
  //           {fmtDate(t!)}
  //         </text>
  //       ))}

  //       {/* Axis titles */}
  //       <text
  //         x={margin.left + innerW / 2}
  //         y={h - 8}
  //         textAnchor="middle"
  //         fontSize={fontAxis}
  //         fill="#111827"
  //       >
  //         Date
  //       </text>
  //       <text
  //         x={12}
  //         y={margin.top + innerH / 2}
  //         textAnchor="middle"
  //         fontSize={fontAxis}
  //         fill="#111827"
  //         transform={`rotate(-90, 12, ${margin.top + innerH / 2})`}
  //       >
  //         Price (USD)
  //       </text>

  //       {/* Line */}
  //       <polyline fill="none" stroke="#2563eb" strokeWidth="2" points={points.join(" ")} />

  //       {/* Points */}
  //       {graphData.map((p, i) => (
  //         <circle key={`pt-${i}`} cx={xScale(p.t)} cy={yScale(p.c)} r={2} fill="#2563eb" />
  //       ))}
  //     </svg>
  //   );
  // };

  return (
    <div className="min-h-screen min-w-screen bg-gray-50 p-4">
      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-4 lg:grid-rows-2 lg:h-[calc(100vh-2rem)]">
        {/* Top-left: Price table */}
        <section
          aria-label="Stock Info Table"
          className="border border-gray-200 rounded-lg bg-white shadow-sm p-4 flex flex-col lg:col-span-1"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Selected Stocks</h2>
          {quoteLoading && <div className="text-gray-500">Loading…</div>}
          {quoteError && <div className="text-red-500">{quoteError}</div>}
          {rows.length === 0 && !quoteLoading && !quoteError && (
            <div className="text-gray-500">Select symbols from search to add them here.</div>
          )}
          {rows.length > 0 && (
            <div className="flex-1 overflow-y-auto md:max-h-full max-h-40">
              <table className="min-w-full text-left text-sm text-gray-800">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b">
                    <th className="py-2 px-3 text-center">Symbol</th>
                    <th className="py-2 px-3 text-center">Price (today)</th>
                    <th className="py-2 px-3 text-center">% Change</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => {
                    const pct = ((row.c - row.pc) / Math.max(1e-9, row.pc)) * 100;
                    return (
                      <tr key={row.symbol} className="border-b hover:bg-stone-200 hover:cursor-pointer group"
                        onClick={() => {
                          setChartSymbol(row.symbol) 
                        }}
                      >
                        <td className="py-2 px-3 font-semibold text-center">{row.symbol}</td>
                        <td className="py-2 px-3 text-center">${row.c.toFixed(2)}</td>
                        <td className={`relative py-2 px-3 text-center ${pct >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {pct.toFixed(2)}%
                          <p 
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log("Clicked remove for:", row.symbol, row.description);
                              handleRemoveSymbol(row.symbol, row.description);
                            }}
                            className="lg:opacity-0 group-hover:opacity-100 absolute text-black right-2.5 top-2 text-lg flex items-center rounded bg-red-200 px-1 h-5 active:scale-75 select-none">
                            &times;
                          </p>
                        </td>
                         
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Top-right: Chart area */}
        <section
          aria-label="Stock Price Info"
          className="border border-gray-200 rounded-lg bg-white shadow-sm p-4 flex flex-col lg:col-span-3"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            {chartSymbol ? `${chartSymbol} (Weekly Close)` : "Stock Price Chart"}
          </h2>
          {/* {graphLoading && <div className="text-gray-500">Loading chart…</div>}
          {graphError && <div className="text-red-500">{graphError}</div>}
          {!graphLoading && !graphError && chartSymbol && graphData.length > 0 && renderLine()}
          {!graphLoading && !graphError && !chartSymbol && (
            <div className="text-gray-500">Select a stock to load its chart.</div>
          )}
          {!graphLoading && !graphError && chartSymbol && graphData.length === 0 && (
            <div className="text-gray-500">No chart data available.</div>
          )} */}
          <Graph chartSymbol={chartSymbol} graphData={graphData} graphLoading={graphLoading} graphError={graphError} viewportW={viewportW} />
        </section>

        {/* Bottom: search area centered */}
        <section
          aria-label="Search"
          className="flex justify-center items-start lg:col-span-4"
        >
          <div className="w-full max-w-4xl border border-gray-200 rounded-lg bg-white shadow-sm p-4 flex flex-col">
            <h1 className="text-black">Search</h1>
            <div className="mt-5 text-gray-400 h-3/4 w-full flex flex-col items-center">
              <SearchBar setResult={setSearchResults} />
              {searchResults && <p>Found {searchResults.count} results</p>}
              <div className="flex flex-col md:items-center gap-y-1 overflow-y-auto max-h-45 min-h-10 w-full rounded">
                {searchResults &&
                  searchResults.result.map((item, idx) => (
                    <StockCard
                      key={idx}
                      description={item.description}
                      displaySymbol={item.displaySymbol}
                      type={item.type}
                      onSelect={() => handleAddSymbol(item.symbol, item.description)}
                      removableComps={CompsInTable}
                      handleRemoveSymbol={handleRemoveSymbol}
                    />
                  ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
