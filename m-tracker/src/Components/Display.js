/* eslint-disable no-undef */
import { useEffect, useState } from "react";


function Display ({ manhwa, chpsRead, lastChp, Title, handleF}) {

    const [rating, setRating] = useState("");

    useEffect(() => {
       if (manhwa.rating !== undefined) {
        setRating(String(manhwa.rating));
       }
    }, [manhwa.rating])

    const chgRating = () => {
        if (rating !== "" && !isNaN(rating) && Number(rating) <= 10) {
            let rate = Number(rating);
            manhwa.rating = rate;
            chrome.storage.local.set({[manhwa.title] : manhwa});
            setRating("");
        }
    }

    return (
        <div className="flex flex-col justify-start items-start">
            <div className="flex flex-row items-start justify-start w-full">
                <span className="text-xl font-bold">{Title}</span>
               {manhwa.fav && <img alt="favstar" src={process.env.PUBLIC_URL + '/images/darkfullstar.png'} 
                className="ml-auto max-h-8 max-w-8 z-20"
                onClick={handleF}></img>}
               {!manhwa.fav && <img alt="favstar" src={process.env.PUBLIC_URL + '/images/star.png'} 
                className="ml-auto max-h-8 max-w-8 z-20"
                onClick={handleF}></img>}
            </div>
            <div className="flex flex-row items-start justify-center">
                <img alt="Title for manhwa here..." className="max-w-48 max-h-96 rounded-md" src={manhwa.img}/>
                <div className='flex flex-col items-start p-2'>
                    <div className="overflow-y-scroll no-scrollbar max-h-36 bg-gray-600 text-white rounded-lg">
                        <p className="text-xs text-left p-2">{manhwa.description}</p>
                    </div>
                    <p className="text-base text-white font-bold">Chapters Read: {chpsRead}/{lastChp}</p>
                    <p className="text-white">Current Rating: {manhwa.rating}/10</p>
                    <div className="flex flex-row justify-start items-center space-x-3">
                        <span className="text-white">Rating:</span>
                        <input className="w-12 h-6 p-2 rounded-md text-black" type="number" max="10" min="0" step="0.5" value={rating} 
                            onChange={(e) => setRating(e.target.value)}
                        />
                        <button
                            className="rounded-md bg-stone-500 ease-out duration-200 active:scale-90
                                 text-white hover:bg-stone-700 p-2"
                            onClick={chgRating}
                        >
                            Set
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Display;