/* eslint-disable no-undef */
import { useEffect, useState } from "react";



function MainPage({ goTo, chgState }) {
    // const [msg, setMsg] = useState("Stuff");
    const [list, setList] = useState([]);
    useEffect(() => {
        const fetchManhwas = async () => {
            const result = await new Promise((resolve) => {
                chrome.storage.local.get(null, (result) => {
                    resolve(Object.values(result));
                });
            });

            if (result) {
                setList(result);
                console.log(result);
            }
        };
        fetchManhwas();

        return () => {
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



    return (
        <div className="min-w-[95vh] min-h-[95vh] bg-slate-500 p-4">
            <div className="flex flex-col items-start justify-start text-white">
                {list.length === 0 && "Go Read some Manhwa! (note go to Series Page first so extension can add it"}
                {list.map((manhwa, i) => {
                    const title = manhwa.title;
                    const img = manhwa.img;
                    const len = manhwa.description.length
                    const description = manhwa.description.substring(0,Math.min(len,200));
                    return (
                        <div key={i} className="flex flex-col justify-start items-start"
                            onClick={() => {
                                goTo(title);
                                setTimeout(() => {chgState(2)}, 200);
                            }}
                        >
                            <span className="font-bold text-xl">{title}</span>
                            <div className="flex flex-row justify-start items-start">
                                <img alt="Title for manhwa is..." src={img} className="rounded-md max-w-16 max-h-32" />
                                <p className="text-xs text-left p-2">{description}{len <= 200 ? "": "..."}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
       
        </div>

    );
}

export default MainPage;