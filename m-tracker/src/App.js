/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
import { useEffect, useRef, useState } from 'react';
import MainPage from './MainPage';
import clsx from 'clsx';
import Manhwa from './Manhwa';
import Popup from './Components/Popup';
import DeleteInfo from './Components/DeleteInfo';
import SupportInfo from './SupportInfo';

const Button = ({ text, control, state, value }) => {
  return (
    <button
    className={clsx(
      'appearance-none relative z-0 flex justify-center items-center w-1/2  p-1 h-[5vh] cursor-pointer',
      'text-center rounded-full transition-colors ease-out duration-300 select-none text-xl font-bold',
      {
        'dark:hover:bg-gray-400': state !== value,
        'text-white': state === value,
      },
    )}
    onClick={() => value === 1 ? control(value,true) : control(value)}
    >
      {text}
  </button>
  )
}
const MainDropDown = ({ setStatus, status }) => {
  var options = {0 : "Plan To Read", 1: "Reading", 2: "Completed", 3: "Dropped", 4: "All"};
  var o1 = Object.values(options);
  var options2 = Object.keys(options).map((e,i) => {return {status: Number(e), title: o1[i]}});

  const [open, setOpen] = useState(false);
  return (
    <div className='flex flex-col items-center relative'>
      <button 
      onClick={() => setOpen(prev => !prev)}
      onBlur={() => setTimeout(() => setOpen(_ => false), 150)}
      className='text-center text-xs font-bold bg-gray-600 min-w-20 text-white'
      > { options[status] }</button>
      <div
        className={clsx(
          'absolute mt-5 min-w-20 rounded-md overflow-auto no-scrollbar bg-gray-600',
          'ease-out duration-300 z-10',
          'transform transition-all origin-top flex flex-col',
          {
            'max-h-32 scale-100 visible': open,
            'max-h-0 invisible': !open,
          }
        )}
      >
        {options2.map((elem, i) => {
          return (
            <button key={i} className={clsx(
              "text-black text-center text-xs font-bold ease-out duration-150 hover:text-white",
              {
                "hover:text-black": status !== elem.status,
                "text-white": status === elem.status,
              }
            )}
              onClick={() => setStatus(elem.status)}
            >{elem.title}</button>
          );
        })}
      </div>

    </div>
  )
}

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
  const [confirm2, setConfirm2] = useState(false);
  const [showFav, setFav] = useState(false);
  const [selectAllBut, setButton] = useState(false);  
  const [status, setStatus] = useState(4);

  const infoButtonRef = useRef(null);

  const control = (n, fav = false) => {
    setState(n);
    setFav(fav);
  };  


  useEffect(() => {
    chrome.storage.local.get('isFirstOpen', (result) => {
      if (result.isFirstOpen) {
        // Simulate Info button click if first open
        if (infoButtonRef.current) {
          infoButtonRef.current.click();
        }
        chrome.storage.local.set({ isFirstOpen: false }); // Reset the flag
      }
    });
  }, []);
  
  
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
      control(6);
    }
  }, [title])

  useEffect(() => {
    console.log("Value of showFav: ", showFav);
    console.log("Value of state: ", state);

  }, [state, showFav]);

  return (
    <div className="max-w-[500px] min-w-[500px] min-h-[500px] max-h-[500px] flex flex-col">
      {confirm && <Popup setConfirm={setConfirm}
       popupInfo={<DeleteInfo deleteList={deleteList} 
        toDelete={() => {setTrig(true); setSelect(false); setConfirm(false)}} 
        setConfirm={setConfirm}/>}/> }
        {confirm2 && <Popup setConfirm={setConfirm2} popupInfo={<SupportInfo setConfirm={setConfirm2}/>}/>}
      <div className="flex flex-col bg-slate-500">
        <div
          className="flex flex-row p-2 sticky top-0 z-10 mb-1  rounded-lg"
          >
          <Button text={"Manhwas"} control={control} state={state} value={0}/>
          <Button text={"Favorites"} control={control} state={state} value={1}/>
          {title !== "" && !ifDelete &&
            <Button text={"Current"} control={control} state={state} value={6}/>
          }
           <img 
              ref={infoButtonRef}
              onClick={() => setConfirm2(true)}
              src={process.env.PUBLIC_URL + '/images/Info-icon.png'} alt='Info' 
              className='max-h-5 max-w-5 ml-auto ease-out duration-200 active:scale-90 cursor-pointer'
              />
        </div>
      {state <= 5 &&
      <div className="flex flex-col items-start p-2 mb-2 min-h-24">
        <div className="bg-slate-500 p-4 flex flex-row space-x-2">
        
          <MainDropDown setStatus={setStatus} status={status}/>
          <input value={query} placeholder='Manga/Manhwa Name...' 
            className="min-w-64 min-h-8 text-white bg-gray-400 
            rounded-lg p-2 border-none placeholder:text-white focus:outline-none focus:shadow-md focus:shadow-stone-300"
            onChange={(e) => setQuery(e.target.value)}
            />
          <button
            className="rounded-md min-w-8 min-h-4 font-bold
            bg-cyan-900 text-white p-2 active:scale-90 hover:bg-cyan-950 ease-out duration-200
            transform translate-x-1/4"
            onClick={() => {setSelect(!select); setButton(false)}}
            >
            Edit
          </button>
          {select && <button
            className="rounded-md min-w-8 min-h-4 font-bold
             bg-red-900 text-white p-2 active:scale-90 hover:bg-red-950 ease-out duration-200
              transform translate-x-1/4"
              onClick={() => {if (deleteList.length !== 0) setConfirm(true)}}
          >
            Delete
          </button>}
        </div>
        <div className='flex flex-row space-x-4 items-center'>
         {select && <button
            className={clsx(
              "rounded-md min-w-8 min-h-4 font-bold hover:bg-cyan-900",
              "duration-200 ease-out p-2 ml-4",
              {
                "bg-cyan-700 text-white border-2 border-white" : selectAllBut,
                "bg-slate-500 text-black border-2 border-black": !selectAllBut
              }
            )}
            onClick={() => setButton(!selectAllBut)}
            >
            Select All
          </button>}
          <span className='text-white font-bold text-xl' > {deleteList.length > 0 && "Selected: " + deleteList.length} </span>
        </div>
      </div>  
      }

      </div>
        <div className="flex-grow overflow-y-scroll no-scrollbar">

            {/* Main Page */}
            {state === 0 && <MainPage Title={title} goTo={setTitle2} chgState={setState} query={query} 
            selected={select} setDList={setDList} trigDel={trigDel} Favs={showFav} selectAll={selectAllBut} status={status} />}

            {/* Favorites Pgae */}
            {state === 1 && <MainPage Title={title} goTo={setTitle2} chgState={setState} query={query} 
            selected={select} setDList={setDList} trigDel={trigDel} Favs={showFav} selectAll={selectAllBut} status={status} />}

            {/* Plan to Read Manhwas */}
            {/* {state === 2 && <MainPage Title={title} goTo={setTitle2} chgState={setState} query={query} 
            selected={select} setDList={setDList} trigDel={trigDel} Favs={showFav} selectAll={selectAllBut} state={state} />} */}

            {/* Reading Manhwas */}
            {/* {state === 3 && <MainPage Title={title} goTo={setTitle2} chgState={setState} query={query} 
            selected={select} setDList={setDList} trigDel={trigDel} Favs={showFav} selectAll={selectAllBut} state={state}/>} */}

            {/* Completed Manhwas */}
            {/* {state === 4 && <MainPage Title={title} goTo={setTitle2} chgState={setState} query={query} 
            selected={select} setDList={setDList} trigDel={trigDel} Favs={showFav} selectAll={selectAllBut} state={state}/>} */}

            {/* Dropped Manhwas */}
            {/* {state === 5 && <MainPage Title={title} goTo={setTitle2} chgState={setState} query={query} 
            selected={select} setDList={setDList} trigDel={trigDel} Favs={showFav} selectAll={selectAllBut} state={state}/>} */}

            {/* Current Manhwa if Reading */}
            {state === 6 && !ifDelete && title !== "" && <Manhwa Title={title} 
              onDelete={setDelete} chgState={setState}/>}

            {/* Manhwa clicked on from mainpage */}
            {state === 7 && <Manhwa Title={title2} onDelete={setDelete} chgState={setState}/>}
            


        </div>
    </div>
  );
}

export default App;
