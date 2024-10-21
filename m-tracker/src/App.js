/* eslint-disable no-undef */
import { useEffect, useState } from 'react';
import MainPage from './MainPage';
import clsx from 'clsx';
import Manhwa from './Manhwa';
import Popup from './Components/Popup';

function App() {
  
  const [state, setState] = useState(0);
  const [title, setTitle] = useState("");
  const [title2, setTitle2] = useState("");
  const [titleToDelete, setDelete] = useState("");
  const [ifDelete, setPsibl] = useState(false)
  const [query, setQuery] =  useState("");
  const [select, setSelect] = useState(false);
  const [deleteList, setDList] = useState([]);
  const [trigDel, setTrig] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [showFav, setFav] = useState(false);

  const control = (n) => {
    if (n >= 0 && n <= 2) {
      setState(n);
    }
  };  
  
  
  useEffect(() => {
    const fetchTitle = async () => {
      return new Promise((resolve) => {
        chrome.runtime.sendMessage({ type: 'getTitle' }, (response) => {
          if (response && response.title) {
            resolve(response.title);
          } else {
            resolve(""); // Resolve with empty string if no title is found
          }
        });
      });
    };
  
    const checkTitle = async (val) => {
      return new Promise((resolve) => {
        chrome.storage.local.get([val], (response) => {
          if (Object.keys(response).length === 0) {
            resolve(""); // Resolve with empty string if not found
          } else {
            resolve(val); // Resolve with the title if found
          }
        });
      });
    };
  
    const handleTitle = async () => {
      const titleFromFetch = await fetchTitle();
      const titleToCheck = titleFromFetch ? await checkTitle(titleFromFetch) : ""; // Check the title if it exists
      setTitle(titleToCheck); // Set the title based on the check
    };
  
    handleTitle();
  }, []);
  
  
  useEffect(() => {
    const deleteTitle = async () => {
      const result = await new Promise((resolve) => {
        let deleted = false
        chrome.storage.local.remove([titleToDelete], () => {
          deleted = true;
        });
        resolve(deleted);
      });
    };

    deleteTitle();
    if (titleToDelete !== "" && titleToDelete === title) {
      setPsibl(true);
    }
    setDelete("");

  }, [titleToDelete,title]);


  useEffect(() => {
    const deleteTitles = async () => {
      const listOfDel = await new Promise((resolve) => {
        let deletedTitles = [];
        if (deleteList.length !== 0) {
          let deletionPromises = deleteList.map((mtitle) => {
            return new Promise((resDel) => {
              chrome.storage.local.remove([mtitle], () => {
                deletedTitles.push(mtitle);
                resDel(); // Resolve the promise for each deletion
              });
            });
          });
  
          // Wait for all deletions to complete
          Promise.all(deletionPromises).then(() => {
            resolve(deletedTitles);
          });
        } else {
          resolve([]); // If no titles to delete
        }
      });
  
      if (listOfDel.length > 0) {
        if (listOfDel.includes(title)) {
          setPsibl(true);
        }
      }
    };
  
    if (trigDel) {
      deleteTitles();
      setState(0);
    }
  }, [trigDel]);
  

  useEffect(() => {
    if (trigDel) {
      setTrig(false);
    }
  },[select]);


  useEffect(() => {
    if (title !== "") {
      control(1);
    }
  }, [title])

  return (
    <div className="max-w-[500px] min-w-[500px] min-h-[500px] max-h-[500px] flex flex-col">
      {confirm && <Popup toDelete={() => {setTrig(true); setSelect(false)}} setConfirm={setConfirm}/> }
      <div className="flex flex-col bg-slate-500">
        <div
          className=" flex flex-row p-2 sticky top-0 z-10 mb-1"
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
      <div className="flex flex-col items-start p-2 mb-2">
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
              onClick={() => {if (deleteList.length !== 0) setConfirm(true)}}
          >
            Delete
          </button>}
        </div>
        <button
          type="button"
          className={clsx(
            "ease-out duration-100 active:scale-90 hover:bg-gray-600 rounded-md w-20 min-h-6",
            " font-bold p-2 ml-4",
            {
              "bg-gray-300 text-white border-2 border-white" : showFav,
              "bg-slate-500 text-black border-2 border-black" : !showFav
            }
          )}
          onClick={() => setFav(!showFav)}
        >
          Favorites
        </button>
      </div>  
      }

      </div>
        <div className="flex-grow overflow-y-scroll no-scrollbar">
            {state === 0 && <MainPage Title={title} goTo={setTitle2} chgState={setState} query={query} 
            selected={select} setDList={setDList} trigDel={trigDel} Favs={showFav} />}

            {state === 1 && !ifDelete && title !== "" && <Manhwa Title={title} 
              onDelete={setDelete} chgState={setState}/>}

            {state === 2 && <Manhwa Title={title2} onDelete={setDelete} chgState={setState}/>}
        </div>
    </div>
  );
}

export default App;
