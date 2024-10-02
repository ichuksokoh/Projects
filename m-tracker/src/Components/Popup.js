


function Popup ({ setConfirm, toDelete }) {
    

    return (
        <div className="inset-0 bg-opacity-35 bg-black backdrop-blur-sm absolute rounded-md z-20"
            onClick={() => setConfirm(false)}
        >
            <div
                className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-2/3 
                space-y-8 min-w-96 min-h-64 rounded-lg bg-stone-500 flex flex-col justify-center items-center" 
            >
                <div className="text-white text-2xl font-bold">
                    Are You Sure?
                </div>
                <div className="flex flex-row space-x-8">
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
        </div>
    );
};




export default Popup;