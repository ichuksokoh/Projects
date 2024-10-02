/* eslint-disable no-undef */
import { useEffect, useState } from "react";



function MainPage({ goTo, chgState, query, selected, toBeDeleted }) {
    // const [msg, setMsg] = useState("Stuff");
    const [list, setList] = useState([]);
    const [filterOpts, setFilterOpts] = useState([]);

    useEffect(() => {
        setFilterOpts(list.filter((manhwa) => manhwa.title.toLowerCase().includes(query.toLowerCase())));
    }, [query])

    useEffect(() => {
        const fetchManhwas = async () => {
            const result = await new Promise((resolve) => {
                chrome.storage.local.get(null, (result) => {
                    resolve(Object.values(result));
                });
            });

            if (result) {
                setList(result);
                setFilterOpts(result);
                console.log(result);
            }
        };
        fetchManhwas();

        return () => {
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



    return (
        <div className="min-w-[95vh] bg-slate-500 p-4">
            <div className="flex min-h-[72.15vh] flex-col items-start justify-start text-white">
                {filterOpts.length === 0 && "Go Read some Manhwa! (note go to Series Page first so extension can add it) Or type correctly..."}
                {filterOpts.map((manhwa, i) => {
                    const title = manhwa.title;
                    const img = manhwa.img;
                    const len = manhwa.description.length
                    const description = manhwa.description.substring(0,Math.min(len,200));
                    return (
                        <div className="flex flex-row items-center">
                            {selected &&
                                <div className="rounded-3xl min-w-8 min-h-8 max-w-8 max-h-8 bg-gray-400
                                ease-out duration-100 active:scale-95"></div>
                            }
                            <div key={i} className="flex flex-col justify-start items-start
                            hover:bg-slate-700 ease-out duration-150 p-2 rounded-md active:scale-95"
                                onClick={() => {
                                    goTo(title);
                                    setTimeout(() => {chgState(2)}, 100);
                                }}
                            >
                                <span className="font-bold text-xl">{title}</span>
                                <div className="flex flex-row justify-start items-start">
                                    <img alt="Title for manhwa is..." src={img} className="rounded-md max-w-16 max-h-32" />
                                    <p className="text-xs text-left p-2">{description}{len <= 200 ? "": "..."}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
       
        </div>

    );
}

export default MainPage;