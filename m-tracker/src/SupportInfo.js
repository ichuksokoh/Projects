import clsx from "clsx";



export default function SupportInfo ({ setConfirm }) {
    var supportedSites = [
        "Asura Scans",
        "Flame Comics",
        "Reaper Scans",
        "Manganato",
        "Mangago",
        "Mangakakalot"
    ].sort((a,b) => a.toLowerCase().localeCompare(b.toLowerCase()));

    return (
        <div className="flex flex-col">
            <span className="text-white font-bold text-lg">
                Supported Sites:
            </span>
            <div className="flex flex-col overflow-y-scroll no-scrollbar items-center">
                {supportedSites.map((e,i) => <span className="text-white" key={i}>{e}</span>)}
            </div>
            <button
                className={clsx(
                    "rounded-md p-2 min-h-6 min-w-12 bg-cyan-700",
                    "duration-200 ease-out hover:bg-cyan-900 active:scale-90",
                    "text-white mt-4"
                )}
                onClick={() => setConfirm(false)}
            >
                Close
            </button>
        </div>
    );
}