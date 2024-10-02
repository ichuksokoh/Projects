

function Card ({ goTo, chgState, manhwa, setBoxes, selected }) {

    const title = manhwa.title;
    const img = manhwa.img;
    const len = manhwa.description.length
    const description = manhwa.description.substring(0,Math.min(len,200));

    return (
        <div>
            <div className="flex flex-col justify-start items-start
            hover:bg-slate-700 ease-out duration-150 p-2 rounded-md active:scale-95"
                onClick={() => {
                    if (selected) {
                        setBoxes(prev => {
                            let boxes = [...prev];
                            if (boxes.find(box => box === manhwa.title) !== undefined) {
                                boxes = boxes.filter(elemt => elemt !== manhwa.title);
                            }
                            else {
                                boxes.push(manhwa.title);
                            }
                            return boxes;
                        })
                    }
                    else {
                        goTo(title);
                        setTimeout(() => {chgState(2)}, 100);
                    }
                }}
            >
                <span className="font-bold text-xl">{title}</span>
                <div className="flex flex-row justify-start items-start">
                    <img alt="Title for manhwa is..." src={img} className="rounded-md max-w-16 max-h-32" />
                    <p className="text-xs text-left p-2">{description}{len <= 200 ? "": "..."}</p>
                </div>
            </div>
        </div>
    );
};

export default Card;