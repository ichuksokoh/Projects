/* eslint-disable no-undef */
import clsx from "clsx";
import { useEffect, useState } from "react";


const ButtonCard = ({text, handleClick, status, state}) => {
    return (
        <button
            className={clsx(
                "rounded-lg max-w-24 max-h-8 p-1 bg-gray-500 text-xxs active:bg-gray-700 hover:bg-gray-600",
                "ease-out duration-150 border-[1.5px] border-gray-800",
                {
                    'bg-stone-100' : state === status,
                    'active:bg-stone-300' : state === status,
                    'hover:bg-stone-200' : state === status,
                    'text-black' : state === status,
                }
            )}
            onClick={() => handleClick(status)}
        >
            {text}
        </button>
    )
}


function Display ({ manhwa, chpsRead, lastChp, Title, handleF, handleH}) {

    const [rating, setRating] = useState("");
    const [stateStatus, setStatus] = useState(-1);
    const handleClick = (status) => {
        manhwa.status = status;
        chrome.storage.local.set({ [manhwa.title]: manhwa });
        setStatus(_ => status);
    }

    useEffect(() => {
        if (manhwa.status !== undefined) {
            setStatus(manhwa.status)
        }
    }, [manhwa.status]);



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
                <span className="text-lg font-bold">{Title}</span>
                <div className="flex flex-row gap-x-1 ml-auto">
                    {manhwa.hidden && <img alt="hide" src={process.env.PUBLIC_URL + '/images/hide.png'}
                        className="max-h-8 max-w-8 z-20"
                        onClick={handleH}/>}
                    {!manhwa.hidden && <img alt="unhide" src={process.env.PUBLIC_URL + '/images/unhide.png'}
                        className="max-h-8 max-w-8 z-20"
                        onClick={handleH}/>}
                {manhwa.fav && <img alt="favstar" src={process.env.PUBLIC_URL + '/images/darkfullstar.png'} 
                    className="max-h-8 max-w-8 z-20"
                    onClick={handleF}></img>}
                {!manhwa.fav && <img alt="favstar" src={process.env.PUBLIC_URL + '/images/star.png'} 
                    className="max-h-8 max-w-8 z-20"
                    onClick={handleF}></img>}
                </div>
                
            </div>
            <div className="flex flex-row items-start justify-center">
                <img alt="Title for manhwa here..." className="max-w-48 max-h-96 rounded-md" src={manhwa.img}/>
                <div className='flex flex-col items-start p-2'>
                    <div className="overflow-y-scroll no-scrollbar max-h-36 max-w-72 bg-gray-600 text-white rounded-lg">
                        <p className="text-xs text-left p-2">{manhwa.description}</p>
                    </div>
                    <div className="flex flex-wrap space-x-0.5 p-2 max-w-64 gap-1">
                        <ButtonCard text={"Plan To Read"} handleClick={handleClick} status={0} state={stateStatus}/>
                        <ButtonCard text={"Reading"} handleClick={handleClick} status={1} state={stateStatus}/>
                        <ButtonCard text={"Completed"} handleClick={handleClick} status={2} state={stateStatus}/>
                        <ButtonCard text={"Dropped"} handleClick={handleClick} status={3} state={stateStatus}/>
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