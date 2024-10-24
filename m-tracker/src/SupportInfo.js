/* eslint-disable no-undef */
import clsx from "clsx";



export default function SupportInfo ({ setConfirm }) {
    var supportedSites = [
        { name: "Asura Scans", link: "https://asuracomic.net/"},
       { name: "Flame Comics", link: "https://flamecomics.xyz/"},
        { name: "Reaper Scans", link: "https://reaperscans.com/"},
       { name: "Manganato", link:  "https://manganato.com/"},
       { name: "Mangago", link: "https://www.mangago.me/"},
        { name: "Mangakakalot", link: "https://mangakakalot.com/"}
    ].sort((a,b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

    const openLink = (link) => {
        chrome.tabs.create(({url: link}))
    };

    return (
        <div className="flex flex-col">
            <span className="text-white font-bold text-lg">
                Supported Sites:
            </span>
            <div className="flex flex-col overflow-y-scroll no-scrollbar items-center">
                {supportedSites.map((elem,i) => <span 
                className="text-white cursor-pointer duration-150 ease-out hover:text-sky-500
                            active:scale-90" 
                    onClick={() => openLink(elem.link)} key={i} >{elem.name}</span>)}
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