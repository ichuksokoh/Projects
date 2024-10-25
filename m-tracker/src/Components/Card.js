/* eslint-disable no-undef */

import { useEffect, useState } from "react";


function Card ({ goTo, chgState, manhwa, setBoxes, selected, setChgFav }) {
    const title = manhwa.title;
    const img = manhwa.img;
    const len = manhwa.description.length
    const description = manhwa.description.substring(0,Math.min(len,200));
    const [faved, setFaved] = useState(false)

    const readChps = () =>  {
        let lastRead = 0;
        for (const item of manhwa.chapters) {
            if (item.read === true) {
                lastRead = item.chapter;
            }
        }
        return lastRead;
    }

    const lastChp = () => {
        let len = manhwa.chapters.length
        return manhwa.chapters[len-1].chapter
    }

    const handleFav = (e, manhwa) => {
        e.stopPropagation();
        manhwa.fav = !manhwa.fav;
        chrome.storage.local.set({ [manhwa.title]: manhwa });
        setFaved(!faved);
        setChgFav(prev => !prev)
    }

    useEffect(() => {

    }, [faved])


    return (
        <div>
            <div className="flex flex-col justify-start items-start
            hover:bg-slate-700 ease-out duration-150 p-2 rounded-md active:scale-95"
                onClick={() => {
                    if (selected) {
                        setBoxes(prev => {
                            let boxes = [...prev];
                            if (boxes.find(box => box === manhwa.title) !== undefined) {
                                boxes = boxes.filter(elemt => elemt !== manhwa.title);
                            }
                            else {
                                boxes.push(manhwa.title);
                            }
                            return boxes;
                        })
                    }
                    else {
                        goTo(title);
                        setTimeout(() => {chgState(2)}, 100);
                    }
                }}
            >   
                <div className="flex flex-row w-full">
                    <div className="flex flex-col items-start justify-start pb-2 space-y-1">
                        <span className="font-bold text-xl">{title}</span>
                        <span className="text-xs text-white">Chps read {readChps()}/{lastChp()}</span>
                        <span className="text-xs text-white">Rating: {manhwa.rating !== undefined ? manhwa.rating : 0}/10 </span>
                    </div>
                        {manhwa.fav && <img alt="favstar" src={process.env.PUBLIC_URL + '/images/darkfullstar.png'} className="ml-auto max-h-8 max-w-8 z-20"
                            onClick={(e) => handleFav(e,manhwa)}></img>}
                        {!manhwa.fav && <img alt="juststar" src={process.env.PUBLIC_URL + '/images/star.png'} className="ml-auto max-h-8 max-w-8 z-20"
                            onClick={(e) => handleFav(e,manhwa)}></img>}
                </div>
                <div className="flex flex-row justify-start items-start">
                    <img alt="Title for manhwa is..." src={img} className="rounded-md max-w-16 max-h-32" />
                    <p className="text-xs text-left p-2">{description}{len <= 200 ? "": "..."}</p>
                </div>
            </div>
        </div>
    );
};

export default Card;