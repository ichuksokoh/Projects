/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';

function Manhwa({ Title, onDelete, chgState }) {
    const [selectedOption, setSelectedOption] = useState(''); // State to hold the selected option
    const [marked, setMarked] = useState(false);
    const [manhwa, setManhwa] = useState({});
    const [chpsRead, setRead] = useState(0);

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
            <div className="flex flex-col justify-start items-start">
                <span className="text-xl font-bold">{Title}</span>
                <div className="flex flex-row items-start justify-center">
                    <img alt="Title for manhwa here..." className="max-w-48 max-h-96 rounded-md" src={manhwa.img}/>
                    <div className='flex flex-col items-start p-2'>
                        <div className="overflow-y-scroll no-scrollbar max-h-32 bg-gray-600 text-white rounded-lg">
                            <p className="text-xs text-left p-2">{manhwa.description}</p>
                        </div>
                        <p className="text-xl text-white font-bold">Chapters Read: {chpsRead}</p>
                    </div>
                </div>
            </div>

            <label htmlFor="myDropdown" className="mb-2 text-sm font-medium">
                Select an option:
            </label>
            <select
                id="myDropdown"
                value={selectedOption} // Controlled component
                onChange={handleChange} // Handle change event
                className="block w-full p-2 border border-gray-300 rounded-md text-black"
            >
                <option className="text-black"  value="">-- Please choose an option --</option>
                {
                    manhwa.chapters?.map((chp,i) => {

                        return (
                            <option key={i + (i+1)*23} value={i}>
                                {chp.chapter}
                            </option>
                        )
                    })
                }
            </select>
            {selectedOption && manhwa.chapters[selectedOption] && (
                 <p className="mt-2 text-white">
                    You selected: {manhwa.chapters[selectedOption].chapter}
                </p>
                 )}
            
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
                        onClick={toDelete}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Manhwa;
