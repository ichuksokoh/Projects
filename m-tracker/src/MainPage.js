/* eslint-disable no-undef */
import { useEffect, useState } from "react";
import Card from "./Components/Card";
import clsx from "clsx";


function MainPage({ goTo, chgState, query, selected, setDList, trigDel, Favs }) {
    const [list, setList] = useState([]);
    const [filterOpts, setFilterOpts] = useState([]);
    const [selectBoxes, setBoxes] = useState([]);

    useEffect(() => {
        if (!Favs) {
            setFilterOpts(list.filter((manhwa) => manhwa.title.toLowerCase().includes(query.toLowerCase())));
        }
        else {
            setFilterOpts(list.filter((manhwa) => 
                    manhwa.fav && (manhwa.title.toLowerCase().includes(query.toLowerCase()))));
        }
    }, [query])

    useEffect(() => {
        if (Favs) {
            setFilterOpts(list.filter((manhwa) => manhwa.fav))
        }
        else {
            setFilterOpts(list);
        }
    }, [Favs])

    useEffect(() => {
        const fetchManhwas = async () => {
            const result = await new Promise((resolve) => {
                chrome.storage.local.get(null, (result) => {
                    resolve(Object.values(result));
                });
            });

            if (result) {
                setList(result);
                setBoxes([]);
                setFilterOpts(result);
            }
        };
        fetchManhwas();

        return () => {
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trigDel]);

    useEffect(() => {
        if (!selected) {
            setDList([]);
            setBoxes([]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected])

    useEffect(() => {
        if (selectBoxes.length !== 0) {
            let psibls = []
            selectBoxes.forEach((psiblDelete) => {
                    psibls.push(psiblDelete);
            })
            setDList(psibls);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[selectBoxes]);



    return (
        <div className="min-w-[95vh] bg-slate-500 p-4">
            <div className="flex min-h-[72.15vh] flex-col items-start justify-start text-white">
                {!Favs && filterOpts.length === 0 && "Go Read some Manhwa! (note go to Series Page first so extension can add it) Or type correctly..."}
                {Favs && filterOpts.length === 0 && "You don't like anything smh"}
                {filterOpts.map((manhwa, i) => {
                    let inBoxes = selectBoxes.find(box => box === manhwa.title) !== undefined;
                    return (
                        <div key={i} className="flex flex-row items-center">
                        {selected &&
                            <div className="min-w-10 min-h-32 ease-out duration-100 
                            hover:bg-gray-700 flex flex-row items-center justify-center rounded-md"
                            onClick={() => setBoxes(prev => {
                                let boxes = [...prev]; 
                                if (boxes.find(box => box === manhwa.title) !== undefined) {
                                    boxes = boxes.filter((elemt) => elemt !== manhwa.title);
                                }
                                else {
                                    boxes.push(manhwa.title);
                                }
                                return boxes;})}
                            >
                                    <div className={clsx(
                                        "rounded-3xl min-w-8 min-h-8 max-w-8 max-h-8",
                                        "ease-out duration-100 active:scale-95 z-10",
                                        {
                                            "bg-blue-600" : inBoxes,
                                            "bg-gray-400" : !inBoxes,
                                        }
                                    )}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setBoxes(prev => {
                                        let boxes = [...prev]; 
                                        if (boxes.find(box => box === manhwa.title) !== undefined) {
                                            boxes = boxes.filter((elemt) => elemt !== manhwa.title);
                                        }
                                        else {
                                            boxes.push(manhwa.title);
                                        }
                                        return boxes;})}}
                                    ></div>
                            </div>
                                   }
                            <Card manhwa={manhwa} selected={selected} setBoxes={setBoxes} goTo={(arg) => !selected ? goTo(arg) : null } chgState={(arg) => !selected ? chgState(arg) : null}/>
                        </div>
                    );
                })}
            </div>
       
        </div>

    );
}

export default MainPage;