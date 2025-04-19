/* eslint-disable no-undef */
import clsx from "clsx";
import { useState } from "react";



export default function SupportInfo ({ setConfirm }) {
    var supportedSites = [
        { name: "Asura Scans", link: "https://asuracomic.net/"},
       { name: "Flame Comics", link: "https://flamecomics.xyz/"},
        { name: "Reaper Scans", link: "https://reaperscans.com/"},
       { name: "Manganato", link:  "https://www.natomanga.com/"},
       { name: "Mangago", link: "https://www.mangago.me/"},
        { name: "Mangakakalot", link: "https://www.mangakakalot.gg"},
        {name : "DrakeScans", link: "https://drakecomic.org"},
        {name : "VoidScans", link: "https://hivetoon.com"},
        {name : "AstraScans", link: "https://astrascans.org/"},
        {name: "NightScans", link: "https://nightsup.net/"},
        {name: "Rizz Comics", link: "https://rizzfables.com/"},
        {name: "BATO.TO", link: "https://bato.to"}
    ].sort((a,b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

    const openLink = (link) => {
        chrome.tabs.create(({url: link}))
    };

    const [info, setInfo] = useState(true);

    const navLeft = () => {
        setInfo(prev => !prev);
    }

    const navRight = () => {
        setInfo(prev => !prev);
    }

    return (
        <div className="flex flex-col items-center">
            <div className="flex flex-row justify-center gap-x-4 select-none">
                <img src={process.env.PUBLIC_URL + 'images/angleRight.png'} alt="left"
                    onClick={navLeft}
                    className="active:scale-90 ease-out duration-200 max-w-8 max-h-8 rotate-180"
                />
                {info && <div className={clsx(
                    "flex flex-col items-center justify-center min-w-44 max-h-32",
                )}>
                    <span className="text-white font-bold text-lg">
                        Supported Sites:
                    </span>
                    <div className="flex flex-col overflow-y-scroll no-scrollbar items-center relative p-1 max-h-28">
                        {supportedSites.map((elem,i) => <span 
                        className="text-white cursor-pointer duration-150 ease-out hover:text-sky-500
                                    active:scale-90 transform hover:-translate-y-1" 
                            onClick={() => openLink(elem.link)} key={i} >{elem.name}</span>)}
                    </div>
                </div>}
            {!info && <div className={clsx(
                "flex flex-col items-center justify-center max-w-44 max-h-32",
            )}>
                    <span className="text-white font-bold text-lg">Using Hidden: </span>
                    <div className="max-w-full overflow-auto no-scrollbar flex flex-col items-center">
                        <span className="text-white text-center">Access Manhwas that you've hidden by shift-clicking Favorites.</span>
                        <span className="text-white text-center">Do this by pressing the shift-button, then clicking on the text "Favorites".</span>
                        <span className="text-white text-center">To Hide Manhwa click on the eye icon in a specific manhwa.</span>
                    </div>
                   
                </div>}
                <img src={process.env.PUBLIC_URL + 'images/angleRight.png'} alt="right"
                    onClick={navRight}
                    className="active:scale-90 ease-out duration-200 max-w-8 max-h-8 select-none"
                />
            </div>
            <button
                    className={clsx(
                        "rounded-md p-2 min-h-6 min-w-24 bg-cyan-700",
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