




export default function Graph({chartSymbol, graphData, graphLoading, graphError, viewportW} 
    : {chartSymbol: string | null, graphData: Array<{ t: number; c: number }>, graphLoading: boolean, graphError: string | null, viewportW: number}) {
      const renderLine = () => {
    if (!graphData.length) return null;
    const isNarrow = viewportW < 640;

    const prices = graphData.map((p) => p.c);
    const times = graphData.map((p) => p.t);
    const minC = Math.min(...prices);
    const maxC = Math.max(...prices);
    const minT = Math.min(...times);
    const maxT = Math.max(...times);

    // Layout
    const w = 1100; // viewBox width (stays fixed; scales via viewBox)
    const h = 350;  // viewBox height (stays fixed; scales via viewBox)
    const margin = {
      top: 12,
      right: 12,
      bottom: isNarrow ? 36 : 48,
      left: isNarrow ? 48 : 64,
    };
    const innerW = w - margin.left - margin.right;
    const innerH = h - margin.top - margin.bottom;
    const fontTick = isNarrow ? 8 : 10;
    const fontAxis = isNarrow ? 9 : 11;

    const xScale = (t: number) =>
      margin.left + ((t - minT) / Math.max(1, maxT - minT)) * innerW;
    const yScale = (c: number) =>
      margin.top + innerH - ((c - minC) / Math.max(1e-9, maxC - minC)) * innerH;

    const points = graphData.map((p) => `${xScale(p.t)},${yScale(p.c)}`);

    // Y ticks (5)
    const yTicks = Array.from({ length: 7 }, (_, i) => minC + ((maxC - minC) * i) / 6);
    // X ticks (up to 6 evenly spread)
    const xTicks = Array.from({ length: Math.min(6, graphData.length) }, (_, i) => {
      const idx = Math.round((i / Math.max(1, Math.min(5, graphData.length - 1))) * (graphData.length - 1));
      return graphData[idx]?.t;
    }).filter((v, i, arr) => v != null && arr.indexOf(v) === i);

    const fmtDate = (t: number) => {
      const d = new Date(t);
      return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear().toString().slice(-2)}`;
    };

    return (
      <svg
        width="100%"
        height="auto"
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-auto max-h-55 sm:max-h-70 md:max-h-90"
      >
        {/* Grid lines */}
        {yTicks.map((y, i) => (
          <line
            key={`ygrid-${i}`}
            x1={margin.left}
            x2={margin.left + innerW}
            y1={yScale(y)}
            y2={yScale(y)}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}
        {xTicks.map((t, i) => (
          <line
            key={`xgrid-${i}`}
            x1={xScale(t!)}
            x2={xScale(t!)}
            y1={margin.top}
            y2={margin.top + innerH}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}

        {/* Axes */}
        <line
          x1={margin.left}
          x2={margin.left}
          y1={margin.top}
          y2={margin.top + innerH}
          stroke="#111827"
          strokeWidth="1.5"
        />
        <line
          x1={margin.left}
          x2={margin.left + innerW}
          y1={margin.top + innerH}
          y2={margin.top + innerH}
          stroke="#111827"
          strokeWidth="1.5"
        />

        {/* Tick labels Y */}
        {yTicks.map((y, i) => (
          <text
            key={`ylabel-${i}`}
            x={margin.left - 8}
            y={yScale(y) + 4}
            textAnchor="end"
            fontSize={fontTick}
            fill="#374151"
          >
            {y.toFixed(2)}
          </text>
        ))}

        {/* Tick labels X */}
        {xTicks.map((t, i) => (
          <text
            key={`xlabel-${i}`}
            x={xScale(t!)}
            y={margin.top + innerH + 16}
            textAnchor="middle"
            fontSize={fontTick}
            fill="#374151"
          >
            {fmtDate(t!)}
          </text>
        ))}

        {/* Axis titles */}
        <text
          x={margin.left + innerW / 2}
          y={h - 8}
          textAnchor="middle"
          fontSize={fontAxis}
          fill="#111827"
        >
          Date
        </text>
        <text
          x={12}
          y={margin.top + innerH / 2}
          textAnchor="middle"
          fontSize={fontAxis}
          fill="#111827"
          transform={`rotate(-90, 12, ${margin.top + innerH / 2})`}
        >
          Price (USD)
        </text>

        {/* Line */}
        <polyline fill="none" stroke="#2563eb" strokeWidth="2" points={points.join(" ")} />

        {/* Points */}
        {graphData.map((p, i) => (
          <circle key={`pt-${i}`} cx={xScale(p.t)} cy={yScale(p.c)} r={2} fill="#2563eb" />
        ))}
      </svg>
    );
  };
    return <div>
         {graphLoading && <div className="text-gray-500">Loading chart…</div>}
          {graphError && <div className="text-red-500">{graphError}</div>}
          {!graphLoading && !graphError && chartSymbol && graphData.length > 0 && renderLine()}
          {!graphLoading && !graphError && !chartSymbol && (
            <div className="text-gray-500">Select a stock to load its chart.</div>
          )}
          {!graphLoading && !graphError && chartSymbol && graphData.length === 0 && (
            <div className="text-gray-500">No chart data available.</div>
          )}
    </div>;
}