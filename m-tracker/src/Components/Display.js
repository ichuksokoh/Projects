

function Display ({ manhwa, chpsRead, Title }) {


    return (
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
    );
};

export default Display;