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
  // const [currentDelete, setCurrentDelete] = useState("");
  const [ifDelete, setPsibl] = useState(false)

  const control = (n) => {
    if (n >= 0 && n <= 2) {
      setState(n);
    }
  }

  // useEffect(() => {
  //   const deleteTitle = async () => {
  //     const result = await new Promise((resolve) => {
  //       let deleted = false
  //       chrome.storage.local.remove([currentDelete], () => {
  //         deleted = true;
  //       });
  //       resolve(deleted);
  //     });
  //     if (result) {
  //       console.log("deleted: ", currentDelete);
  //     }
  //   };

  //   deleteTitle();
  //   if(currentDelete !== "") {
  //     setPsibl(true);
  //   }
  //   setCurrentDelete("");

  // }, [currentDelete])

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
    if (titleToDelete !== "") {
      setPsibl(true);
    }
    setDelete("");

  }, [titleToDelete])


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
        <div
          className="bg-slate-500 flex flex-row p-2 sticky top-0 z-10"
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
        <div className="flex-grow overflow-y-scroll no-scrollbar">
            {state === 0 && <MainPage Title={title} goTo={setTitle2} chgState={setState} />}
            {state === 1 && !ifDelete && title !== "" && <Current Title={title} onDelete={setDelete} chgState={setState}/>}
            {state === 2 && <Manhwa Title={title2} onDelete={setDelete} chgState={setState}/>}
        </div>
    </div>
  );
}

export default App;
