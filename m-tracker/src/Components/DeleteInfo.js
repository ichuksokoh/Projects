


export default function DeleteInfo ({ deleteList, setConfirm, toDelete }) {

    return (
        <div>
            {deleteList && <span className="text-white text-xs ">Delete selected ({deleteList.length}): </span>}
            <div className="overflow-y-scroll no-scrollbar max-h-16 rounded-md text-white flex flex-col text-xs">
                    {
                    deleteList && deleteList.map((e,i) => <span key={i}>{e}</span>)
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