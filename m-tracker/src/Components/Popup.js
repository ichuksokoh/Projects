


function Popup ({ deleteList, setConfirm, toDelete, popupInfo }) {

    return (
        <div className="inset-0 bg-opacity-35 bg-black backdrop-blur-sm absolute rounded-md z-50"
            onClick={() => setConfirm(false)}
        >
            <div
                className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-2/3 
                space-y-8 min-w-96 min-h-64 rounded-lg bg-stone-500 flex flex-col justify-center items-center" 
                onClick={(e) => e.stopPropagation()}
            >
                {popupInfo}
            </div>
        </div>
    );
};




export default Popup;