


export default function DeleteInfo ({ deleteList, setConfirm, toDelete }) {

    return (
        <div className="flex flex-col justify-center items-center">
            {deleteList && <span className="text-white text-xs ">Delete selected ({deleteList.length}): </span>}
            <div className="overflow-y-scroll relative no-scrollbar max-h-28 rounded-md 
                text-white text-center space-y-1 flex flex-col items-center text-xs p-2">
                    {
                    deleteList && deleteList.map((e,i) => {return (
                            <div className="transform hover:-translate-y-1" key={i}>
                                <span className="hover:bg-stone-300 hover:text-black ease-out duration-150 p-1 rounded-md"
                                >{e}</span>
                            </div>
                            )
                        })
                }
            </div>
            <div className="text-white text-2xl font-bold">
                Are You Sure?
            </div>
            <div className="flex flex-row space-x-8 text-white">
                <button
                    type="button"
                    className="ease-out duration-200 active:scale-90 bg-blue-800 hover:bg-blue-900
                    min-w-16 min-h-8 rounded-lg text-xl font-bold"
                    onClick={toDelete}
                >
                    Yes
                </button>
                <button
                    type="button"
                    className="ease-out duration-200 active:scale-90 bg-red-800 hover:bg-red-900
                    min-w-16 min-h-8 rounded-lg text-xl font-bold"
                    onClick={() => setConfirm(false)}
                >
                    No
                </button>
            </div>
        </div>
    );
}