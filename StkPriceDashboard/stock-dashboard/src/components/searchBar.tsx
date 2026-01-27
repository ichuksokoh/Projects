import { useEffect, useState } from "react";
import { symbolSearch } from "../api/services";
import type { StockSearchResult } from "../types";


export default function SearchBar({ setResult }: { setResult: (data: StockSearchResult | null) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<StockSearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!query) {
      setResults(null);
      return;
    }


    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await symbolSearch(query);
        setResults(data);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    }, 400); // debounce delay

   

    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    console.log("Search results:", results);
    if (results !== undefined) {
      setResult(results);
    }
  }, [results]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search stocks..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="md:w-125 w-full bg-gray-100 p-2 text-black border border-gray-300 rounded outline-none"
      />
    </div>
  );
}
