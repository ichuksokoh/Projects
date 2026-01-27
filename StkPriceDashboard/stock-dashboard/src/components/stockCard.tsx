export default function StockCard({description, displaySymbol, onSelect, handleRemoveSymbol, removableComps}: {
  description: string;
  displaySymbol: string;
  onSelect?: () => void;
  handleRemoveSymbol?: (symbol: string, description: string) => void;
  removableComps?: Set<string>;
}) {
  return (
    <div
      onClick={onSelect}
      className="cursor-pointer md:w-1/2  sm:max-w-11/12 h-10 border-gray-300 border rounded p-2 text-black flex justify-left flex-row gap-x-2 hover:bg-stone-100"
    >
        <h2 className="h-full lg:text-[16px] text-xs p-2 flex justify-center items-center bg-stone-200 rounded"> {displaySymbol}</h2> :
        <p className="flex lg:text-[16px] text-xs items-center justify-center rounded p-2 bg-stone-200"> {description}</p>
        {/* <p className="flex items-center justify-center rounded p-2 bg-stone-200"> {type}</p> */}
        {removableComps && removableComps.has(displaySymbol + description.toLowerCase()) && handleRemoveSymbol && (
          <p
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveSymbol(displaySymbol, description);
            }}
            className="ml-auto bg-red-300 text-white pb-1 px-1 text-2xl flex justify-center items-center rounded"
          >
           &times;
          </p>
        )}
     
    </div>
  );
}