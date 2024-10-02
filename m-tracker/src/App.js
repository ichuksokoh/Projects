/* eslint-disable no-undef */
import { useEffect, useState } from 'react';
import MainPage from './MainPage';
import Current from './Current';
import clsx from 'clsx';
import Manhwa from './Manhwa';

function App() {
  
  const [state, setState] = useState(0);
  const [title, setTitle] = useState("");
  const [title2, setTitle2] = useState("");
  const [titleToDelete, setDelete] = useState("");
  const [ifDelete, setPsibl] = useState(false)
  const [query, setQuery] =  useState("");
  const [select, setSelect] = useState(false);
  const [deleteList, setDList] = useState([]);

  const control = (n) => {
    if (n >= 0 && n <= 2) {
      setState(n);
    }
  }



  useEffect(() => {
    const deleteTitle = async () => {
      const result = await new Promise((resolve) => {
        let deleted = false
        chrome.storage.local.remove([titleToDelete], () => {
          deleted = true;
        });
        resolve(deleted);
      });
      if (result) {
        console.log("deleted: ", titleToDelete);
      }
    };

    deleteTitle();
    if (titleToDelete !== "" && titleToDelete === title) {
      setPsibl(true);
    }
    setDelete("");

  }, [titleToDelete,title])


  useEffect(() => {
    const fetchTitle = async () => {
      const result = await new Promise((resolve) => {
        chrome.runtime.sendMessage({type: 'getTitle' }, (response) => {
          if (response && response.title) {
            resolve(response.title);
          }
        });
      });
      if (result) {
        setTitle(result);
      }
    }

    fetchTitle();

  },[])


  return (
    <div className="max-w-[500px] min-w-[500px] min-h-[500px] max-h-[500px] flex flex-col">
      <div className="flex flex-col bg-slate-500">
        <div
          className=" flex flex-row p-2 sticky top-0 z-10"
        >
          <button
             className={clsx(
              'appearance-none relative z-0 flex justify-center items-center w-1/2 h-[5vh] cursor-pointer',
              'text-center rounded-full transition-colors ease-out duration-300 select-none text-xl font-bold',
              {
                'dark:hover:bg-gray-400': state === 1,
                'text-white': state === 0,
              },
            )}
            onClick={() => control(0)}
          >
            Manhwas
          </button>
          {title !== "" && !ifDelete &&
            <button
              className={clsx(
                'appearance-none relative z-0 flex justify-center items-center w-1/2 h-[5vh] cursor-pointer',
                'text-center rounded-full transition-colors ease-out duration-300 select-none text-xl font-bold',
                {
                  'dark:hover:bg-gray-400': state === 0,
                  'text-white': state === 1,
                },
              )}
              onClick={() => control(1)}
            >
              Current
            </button>
          }
        </div>
      {state === 0 &&  
        <div className="bg-slate-500 p-4 flex flex-row space-x-8">
          <input value={query} placeholder='Manga/Manhwa Name...' 
            className="min-w-64 min-h-8 text-white bg-gray-400 
              rounded-lg p-2 border-none placeholder:text-white focus:outline-none focus:shadow-md focus:shadow-stone-300"
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            className="rounded-md min-w-8 min-h-4 font-bold
             bg-cyan-900 text-white p-2 active:scale-90 hover:bg-cyan-950 ease-out duration-200
             transform translate-x-1/2"
             onClick={() => setSelect(!select)}
          >
            Edit
          </button>
          {select && <button
            className="rounded-md min-w-8 min-h-4 font-bold
             bg-red-900 text-white p-2 active:scale-90 hover:bg-red-950 ease-out duration-200
              transform translate-x-1/2"
          >
            Delete
          </button>}
        </div>
      }

      </div>
        <div className="flex-grow overflow-y-scroll no-scrollbar">
            {state === 0 && <MainPage Title={title} goTo={setTitle2} chgState={setState} query={query} 
            selected={select} toBeDeleted={deleteList} />}

            {state === 1 && !ifDelete && title !== "" && <Current Title={title} 
              onDelete={setDelete} chgState={setState}/>}
              
            {state === 2 && <Manhwa Title={title2} onDelete={setDelete} chgState={setState}/>}
        </div>
    </div>
  );
}

export default App;
