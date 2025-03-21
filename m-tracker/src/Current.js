/* eslint-disable no-undef */
import { useEffect, useState } from "react";
import Popup from "./Components/Popup";
import Dropdown from "./Components/Dropdown";
import Display from "./Components/Display";

function Current({ Title, onDelete, chgState }) {
    const [selectedOption, setSelectedOption] = useState(''); // State to hold the selected option
    const [marked, setMarked] = useState(false);
    const [manhwa, setManhwa] = useState({});
    const [chpsRead, setRead] = useState(0);
    const [confirm, setConfirm] = useState(false);

    const handleChange = (event) => {
        setSelectedOption(event.target.value); // Update state with the selected value
        setMarked(true);
    };

    const upload = () => {
        if (marked) {
            manhwa.chapters[selectedOption].read = true;
            chrome.storage.local.set({ [manhwa.title]: manhwa });
            setMarked(false);
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
    useEffect(() => {
        const fetchChps = async () => {
            const result = await new Promise((resolve) => {
                chrome.storage.local.get([Title], (result) => {
                    resolve(result[Title] || {});
                });
            });

            if (result) {
                setManhwa(result);
            }
        };
        fetchChps();
    },[Title, marked])

    useEffect(() => {
        if (manhwa.chapters) {
            setRead(readChps());
        }
    }, [manhwa.chapters])

    return (
        <div className="bg-slate-500 min-w-[95vh] min-h-[95vh] text-white p-2">

            {confirm && <Popup toDelete={toDelete} setConfirm={setConfirm}/>}
            {<Display Title={Title} manhwa={manhwa} chpsRead={chpsRead}/>}
            {<Dropdown selectedOption={selectedOption} handleChange={handleChange} manhwa={manhwa}/>}
                
            <div className="flex flex-col items-start p-2">
                <button
                    type="button"
                    className="rounded-md min-w-16 mt-2 min-h-8 duration-200 ease-out active:scale-90 hover:bg-stone-700 bg-stone-500"
                    onClick={upload}
                >
                    Read
                </button>
                <div className="flex justify-center min-w-[475px]">
                    <button
                        type="button"
                        className="rounded-md bg-stone-500 hover:bg-stone-700 active:scale-90 ease-out duration-200
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

export default Current;
