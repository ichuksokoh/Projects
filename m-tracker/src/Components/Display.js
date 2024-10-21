/* eslint-disable no-undef */
import { useState } from "react";


function Display ({ manhwa, chpsRead, Title }) {

    const [rating, setRating] = useState("");

    const chgRating = () => {
        if (rating !== "" && !isNaN(rating) && Number(rating) <= 10) {
            let rate = Number(rating);
            console.log("Manhwa Title: ", manhwa.title);
            console.log("Manhwa current rating: ",manhwa.rating);
            console.log("rating value: ", rating)
            manhwa.rating = rate;
            chrome.storage.local.set({[manhwa.title] : manhwa});
            setRating("");
        }
    }

    return (
        <div className="flex flex-col justify-start items-start">
            <span className="text-xl font-bold">{Title}</span>
            <div className="flex flex-row items-start justify-center">
                <img alt="Title for manhwa here..." className="max-w-48 max-h-96 rounded-md" src={manhwa.img}/>
                <div className='flex flex-col items-start p-2'>
                    <div className="overflow-y-scroll no-scrollbar max-h-32 bg-gray-600 text-white rounded-lg">
                        <p className="text-xs text-left p-2">{manhwa.description}</p>
                    </div>
                    <p className="text-xl text-white font-bold">Chapters Read: {chpsRead}</p>
                    <p className="text-white">Current Rating: {manhwa.rating}/10</p>
                    <div className="flex flex-row justify-start items-center space-x-3">
                        <span className="text-white">Rating:</span>
                        <input className="w-12 h-6 rounded-md text-black" type="number" max="10" min="0" step="0.5" value={rating} 
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