/* eslint-disable no-undef */
import { useEffect, useState } from 'react';
import './App.css';
import MainPage from './MainPage';
import Current from './Current';
import clsx from 'clsx';
import Manhwa from './Manhwa';

function App() {
  
  const [state, setState] = useState(0);
  const [title, setTitle] = useState("");
  const [title2, setTitle2] = useState("");

  const control = (n) => {
    if (n >= 0 && n <= 2) {
      setState(n);
    }
  }


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
    <div className="max-w-[500px] max-h-[500px] no-scrollbar overflow-y-scroll">
        <div
          className="bg-slate-500 flex flex-row p-2"
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
        </div>
        <div>
            {state === 0 && <MainPage Title={title} goTo={setTitle2} chgState={setState} />}
            {state === 1 && <Current Title={title}/>}
            {state === 2 && <Manhwa Title={title2}/>}
        </div>
    </div>
  );
}

export default App;
