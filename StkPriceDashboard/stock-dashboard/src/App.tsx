function App() {
  return (
    <div className="min-h-screen min-w-screen bg-gray-50 p-4">
      <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[calc(100vh-2rem)]">
        {/* Top-left: Chart area */}
        <section
          aria-label="Stock Price Chart"
          className="col-span-3 border border-gray-200 rounded-lg bg-white shadow-sm p-4 flex"
        >
          <div className="m-auto text-gray-400">
            Chart area placeholder
          </div>
        </section>

        {/* Top-right: Stock price info */}
        <section
          aria-label="Stock Price Info"
          className="col-span-1 border border-gray-200 rounded-lg bg-white shadow-sm p-4"
        >
          <h2 className="text-lg font-semibold text-gray-800">Stock Price Info</h2>
          <p className="mt-2 text-sm text-gray-500">Placeholder content for stock details.</p>
        </section>

        {/* Bottom-left: Other stocks list */}
        <section
          aria-label="Other Stocks"
          className="col-span-2 border border-gray-200 rounded-lg bg-white shadow-sm p-4"
        >
          <h2 className="text-lg font-semibold text-gray-800">Other Stocks</h2>
          <p className="mt-2 text-sm text-gray-500">Placeholder list for selectable stocks.</p>
        </section>

        {/* Bottom-right: Free space for future feature */}
        <section
          aria-label="Free Space"
          className="col-span-2 border border-gray-200 rounded-lg bg-white shadow-sm p-4 flex"
        >
          <div className="m-auto text-gray-400">Free space placeholder</div>
        </section>
      </div>
    </div>
  )
}

export default App
