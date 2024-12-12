/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import Popup from './Components/Popup';
import Dropdown from './Components/Dropdown';
import Display from './Components/Display';
import DeleteInfo from './Components/DeleteInfo';
import MainDropDown from './Components/Dropdown2';

function Manhwa({ Title, onDelete, chgState }) {
    const [selectedOption, setSelectedOption] = useState(''); // State to hold the selected option
    const [marked, setMarked] = useState(false);
    const [manhwa, setManhwa] = useState({});
    const [chpsRead, setRead] = useState(0);
    const [lastChp, setLastChp] = useState(0);
    const [confirm, setConfirm] = useState(false);
    const [addfav, setFav] = useState(false);

    const handleChange = (event) => {
        setSelectedOption(event.currentTarget.value); // Update state with the selected value
    };
    
    
    
    const upload = () => {

        if (selectedOption !== '' && Number(selectedOption) <= manhwa.chapters.length - 1) {
            let chpIdx = Number(selectedOption);
            if (!manhwa.chapters[chpIdx].read) {
                manhwa.status = 1;
            }
        }
        if (selectedOption !== '') {
            let chgRead = manhwa.chapters[selectedOption].read;
            manhwa.chapters[selectedOption].read = !chgRead;
            let readTill = parseInt(selectedOption, 10);
            if (readTill !== 0 && !chgRead) {
                for (let i = 0; i < readTill; i++) {
                    manhwa.chapters[i].read = true;
                }
            }
            chrome.storage.local.set({ [manhwa.title]: manhwa });
            setMarked(!marked);
        }
    }

    const toDelete = () => {
        onDelete(manhwa.title);
        setTimeout(() => {
            chgState(0);
        }, 10);
    };
    
    const readChps = () =>  {
        let lastRead = 0;
        for (const item of manhwa.chapters) {
            if (item.read === true) {
                lastRead = item.chapter;
            }
        }
        return lastRead;
    }

    const finalChp = () => {
        let len = manhwa.chapters.length
        return manhwa.chapters[len-1].chapter
    }
    useEffect(() => {
        const fetchChps = async () => {
            const result = await new Promise((resolve) => {
                chrome.storage.local.get([Title], (result) => {
                    resolve(result[Title] || {});
                });
            });

            if (result) {
                var nextRead = -1;
                var noneRead = result.chapters.map(elem => elem.read).reduce((prev, curr) => prev && !curr, true);
                
                for (let i = 0; i < result.chapters?.length; i++) {
                    if (i === 0 && result.chapters[result.chapters?.length - i - 1].read) {
                        break;
                    }
                    if (result.chapters[result.chapters?.length - i - 1].read) {
                        nextRead = result.chapters?.length - i;
                        break;
                    }
                }
                if (nextRead !== -1) {
                    setSelectedOption(String(nextRead));
                }
                if (noneRead) {
                    nextRead = 0;
                    setSelectedOption(String(nextRead))
                }
                setManhwa(result);
            }
        };
        fetchChps();
    },[Title])
    
    useEffect(() => {
        if (manhwa.chapters) {
            setRead(readChps());
            setLastChp(finalChp());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [manhwa.chapters, marked])
    
    const handleFav = () => {
        manhwa.fav = !manhwa.fav;
        chrome.storage.local.set({ [manhwa.title]: manhwa });
        setFav(!addfav);
    }


    useEffect(() => {

    },[addfav])

    return (
        <div className="bg-slate-500 min-w-[95vh] min-h-[95vh] text-white p-2">

            {confirm && <Popup setConfirm={setConfirm}
                popupInfo={<DeleteInfo deleteList={null} toDelete={toDelete} setConfirm={setConfirm}/>}/>}
            {<Display Title={Title} manhwa={manhwa} chpsRead={chpsRead} lastChp={lastChp} handleF={handleFav}/>}

            <div className="flex flex-col items-start p-2 space-y-5">
                <div className="flex flex-row w-full items-center">
                    {/* <Dropdown selectedOption={selectedOption} handleChange={handleChange} manhwa={manhwa}/> */}
                    <MainDropDown selectedOption={selectedOption} handleChange={handleChange} manhwa={manhwa}/>
                    <button
                        type="button"
                        className="rounded-md min-w-16 mt-5 duration-200 ease-out min-h-9
                            active:scale-90 ml-auto hover:bg-stone-700 bg-stone-500"
                        onClick={upload}
                    >   
                        {selectedOption !== '' && manhwa.chapters[selectedOption].read ? "Unread" : "Read"}
                    </button>
                </div>
                <div className="flex flex-row justify-center min-w-[475px] space-x-60">
                    <button
                         type="button"
                         className="rounded-md bg-stone-500 hover:bg-stone-700 active:scale-90 ease-out duration-200
                             min-w-16 min-h-8 font-bold"
                        onClick={() => chgState(0)}
                    >
                        Back
                    </button>

                    <button
                        type="button"
                        className="rounded-md bg-red-900 hover:bg-red-950 active:scale-90 ease-out duration-200
                            min-w-16 min-h-8 font-bold"
                        onClick={() => setConfirm(true)}
                    >
                        Delete
                    </button>

                </div>
            </div>
        </div>
    );
}

export default Manhwa;
