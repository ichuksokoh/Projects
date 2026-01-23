export default function StockCard({description, displaySymbol, type, onSelect}: {
  description: string;
  displaySymbol: string;
  type: string;
  onSelect?: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className="cursor-pointer max-w-11/12 h-10 border-gray-300 border rounded p-2 text-black flex justify-left flex-row gap-x-2 hover:bg-stone-100"
    >
      <h2 className="h-full p-2 flex justify-center items-center bg-stone-200 rounded">Symbol: {displaySymbol}</h2>
      <p className="flex items-center justify-center rounded p-2 bg-stone-200">Info: {description}</p>
      <p className="flex items-center justify-center rounded p-2 bg-stone-200">Stock Type: {type}</p>
    </div>
  );
}