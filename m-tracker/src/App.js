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
    onClick={(event) => event.shiftKey && value === 1 ? control(4) : control(value)}
    >
      {text}
  </button>
  )
}

const MainSlider = ({ setStatus, status }) => {
  var options = {0 : "Plan To Read", 1: "Reading", 2: "Completed", 3: "Dropped", 4: "All"};
  var o1 = Object.values(options);
  var options2 = Object.keys(options).map((e,i) => {return {status: Number(e), title: o1[i]}});

  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);

  const toggle = (blur = false) => {
    if (show) {
      setShow(false);
      setTimeout(() => {
        setOpen(false);
      }, 320);
    }
    else {
      if (!blur) {
        setOpen(true);
        setTimeout(() => {
          setShow(true);
        }, 100);
      }
    }
  };

  return (
    <div className='flex flex-row items-center relative'>
      <div
          tabIndex={0}
          onClick={() => toggle()}
          // onBlur={() => setTimeout(() => toggle(true), 100)}
          className='flex flex-row justify-center text-xs
           font-bold bg-gray-400 min-w-28 text-white rounded-lg cursor-pointer'
      >
        <span className='px-2 text-center ml-auto'>{ options[status] }</span>
        <img alt='>' 
          className={clsx(
            'transform transition-all max-h-4 ml-auto',
            {
              'rotate-180' : !show,

            }
          )}
          src={process.env.PUBLIC_URL + '/images/angleLeft.png'}/>
      </div>
      {open && <div
        className={clsx(
          'absolute ml-28 h-4 rounded-lg overflow-auto no-scrollbar bg-gray-400',
          'ease-in-out duration-300 z-10 px-2',
          'transform transition-all origin-left flex flex-row gap-x-3',
          {
            'max-w-96 w-80 visible': show,
            'max-w-0 invisible': !show,
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
              onClick={() => {setStatus(elem.status); toggle();}}
            >{elem.title}</button>
          );
        })}
      </div>}

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

  const [selectAllBut, setButton] = useState(false);  
  const [status, setStatus] = useState(4);

  const infoButtonRef = useRef(null);

  const control = (n) => {
    setState(n);
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
  
  console.log("value of Title in App.js: ", title);
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
      control(2);
    }
  }, [title])



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
            <Button text={"Current"} control={control} state={state} value={2}/>
          }
          <img 
            ref={infoButtonRef}
            onClick={() => setConfirm2(true)}
            src={process.env.PUBLIC_URL + '/images/Info-icon.png'} alt='Info' 
            className='max-h-5 max-w-5 ml-auto ease-out duration-200 active:scale-90 cursor-pointer select-none'
            />
        </div>
      {(state <= 1 || state === 4) &&
      <div className="flex flex-col items-start p-2 min-h-20">
        <div className="bg-slate-500 p-2 flex flex-row space-x-2">
          <input value={query} placeholder='Manga/Manhwa Name...' 
            className="min-w-64 min-h-8 text-white bg-gray-400 
            rounded-lg p-2 border-none placeholder:text-white focus:outline-none focus:shadow-md focus:shadow-stone-300"
            onChange={(e) => setQuery(e.target.value)}
            />
          <button
            className="rounded-md min-w-8 min-h-4 font-bold
            bg-cyan-900 text-white p-2 active:scale-90 hover:bg-cyan-950 ease-out duration-200
            transform translate-x-1/2"
            onClick={() => {setSelect(!select); setButton(false)}}
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
        <div className='p-2'>
          <MainSlider setStatus={setStatus} status={status}/>
        </div>
        <div className='flex flex-row space-x-4 items-center h-8'>
         {select && <button
            className={clsx(
              "rounded-md min-w-8 min-h-4 font-bold hover:bg-cyan-900",
              "duration-200 ease-out p-1 ml-2",
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

            {/* Main Page when state === 0*/}
            {/* Favorites Pgae when state === 1 */}  
           {state <= 1 && <MainPage Title={title} goTo={setTitle2} chgState={setState} query={query} 
            selected={select} setDList={setDList} trigDel={trigDel}
              selectAll={selectAllBut} status={status} state={state} />}

            {/* Current Manhwa if Reading */}
            {state === 2 && !ifDelete && title !== "" && <Manhwa Title={title} 
              onDelete={setDelete} chgState={setState}/>}

            {/* Manhwa clicked on from mainpage */}
            {state === 3 && <Manhwa Title={title2} onDelete={setDelete} chgState={setState}/>}
            
            {/* Hiidden Manhwas triggered by shift-clicking Favorites button */}
            {state === 4 && <MainPage Title={title} goTo={setTitle2} chgState={setState} query={query} 
            selected={select} setDList={setDList} trigDel={trigDel}
              selectAll={selectAllBut} status={status} state={state} />}


        </div>
    </div>
  );
}

export default App;
