/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
import { useEffect, useState } from "react";
import Card from "./Components/Card";
import clsx from "clsx";
import { FixedSizeList as List } from "react-window";


function MainPage({ goTo, chgState, query, selected, setDList, trigDel, selectAll, status, state }) {
    const [list, setList] = useState([]);
    const [filterOpts, setFilterOpts] = useState([]);
    const [selectBoxes, setBoxes] = useState([]);
    const [chgFav, setChgFav] = useState(false);
    const [doneFetch, setFetch] = useState(false);

    const ManhwaItem = ({ index, style }) => {
        var man = filterOpts[index];
        let inBoxes = selectBoxes.find(box => box === man.title) !== undefined;
        return (
            <div style={style} key={index} className="flex flex-row items-center">
            {selected &&
                <div className="min-w-10 min-h-44 ease-out duration-100 
                hover:bg-gray-700 flex flex-row items-center justify-center rounded-md"
                onClick={() => setBoxes(prev => {
                    let boxes = [...prev]; 
                    if (boxes.find(box => box === man.title) !== undefined) {
                        boxes = boxes.filter((elemt) => elemt !== man.title);
                    }
                    else {
                        boxes.push(man.title);
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
                            if (boxes.find(box => box === man.title) !== undefined) {
                                boxes = boxes.filter((elemt) => elemt !== man.title);
                            }
                            else {
                                boxes.push(man.title);
                            }
                            return boxes;})}}
                        ></div>
                </div>
                       }
                <div className="transform hover:-translate-y-1">
                    <Card manhwa={man} selected={selected} setBoxes={setBoxes} 
                            goTo={(arg) => !selected ? goTo(arg) : null } 
                            chgState={(arg) => !selected ? chgState(arg) : null}
                            setChgFav={setChgFav}/>    
                </div>
            </div>
        );
    };



    useEffect(() => {
        setFilterOpts(
            list.filter(manhwa => {
                //status goes from 0 to 4, 0 - Plan To Read, 1-Reading
                //2-Completed, 3-Dropped, 4-Goes back to original manhwa page w/no filter
                const matchesStatus = status === 4 || manhwa.status === status;
                const matchesFav = state !== 1 || manhwa.fav; // Only filter by fav if Favs is true
                const matchesQuery = manhwa.title.toLowerCase().includes(query.toLowerCase());
                const matchesHidden = (state !== 4 && !manhwa.hidden) || (state === 4 && manhwa.hidden);
                return matchesStatus && matchesFav && matchesQuery && matchesHidden;
            })
        );
    }, [status, query, list, doneFetch, chgFav, state]);
    



    useEffect(() => {
        const fetchManhwas = async () => {
            const result = await new Promise((resolve) => {
                chrome.storage.local.get(null, (result) => {
                    resolve(Object.values(result).filter(psiblmanhwa => psiblmanhwa.title !== undefined));
                });
            });

            if (result) {
                setList(result);
                setBoxes([]);
                setFetch(true);
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
        else {
            setDList([]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[selectBoxes]);

    useEffect(() => {

        if (selectAll) {
            let psibls = []
            filterOpts.forEach((manhwa) => {
                psibls.push(manhwa.title);
            })
            setDList(psibls);
            setBoxes(psibls);
        }
        else {
            setDList([]);
            setBoxes([]);
        }

    }, [selectAll])





    return (
        <div className="min-w-[95vh] bg-slate-500 p-4">
            <div className="flex min-h-full flex-col items-start justify-start text-white">
                {(state === 0 && status === 4) && filterOpts.length === 0 && "Go Read some Manhwa! (note go to Series Page first so extension can add it) Or type correctly..."}
                {state === 1 && filterOpts.length === 0 && "You don't like anything smh"}
                {state === 4 && filterOpts.length === 0 && "None Hidden! You're not naughty good job!"}
                <List
                     height={295} // Height of the dropdown
                     itemCount={filterOpts.length} // Total number of items
                     itemSize={200} // Height of each item
                     width="100%" // Width of the dropdown
                     className="no-scrollbar flex-grow"
                >
                    {ManhwaItem}
                </List>
            </div>
       
        </div>

    );
}

export default MainPage;