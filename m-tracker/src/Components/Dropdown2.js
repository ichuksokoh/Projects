


import { useState } from "react";
import clsx from "clsx";
import { FixedSizeList as List } from 'react-window';




export default function MainDropDown({ selectedOption, handleChange, manhwa }) {
  
    const [open, setOpen] = useState(false)
    const [show, setShow] = useState(false);

    const ChapterRow = ({ index, style }) => {
        if (index === 0) {
            return (
                <button
                style={style}
                value=""
                onClick={(event) => {handleChange(event); toggle();}}
                className={clsx(
                    "text-black text-center text-xs font-bold ease-out",
                    "duration-150 hover:bg-gray-500",
                    {
                        "hover:text-black": selectedOption === "",
                        "text-white" : selectedOption === "",
                        "hover:text-white" : selectedOption !== "",
                    }
                )}
              >
                --Choose a Chapter--
              </button>
            );
        }
        const chp = manhwa.chapters[index-1];
        return (
                <button
                    style={style}
                    key={index-1}
                    value={index-1}
                    className={clsx(
                        "text-black text-center text-xxs font-bold ease-out duration-150 hover:bg-gray-500",
                        "ml-auto",
                        {
                            "hover:text-black": Number(selectedOption) === index-1 && selectedOption !== "",
                            "hover:text-white": Number(selectedOption) !== index-1,
                            "text-white": Number(selectedOption) === index-1 && selectedOption !== "",
                        }
                    )}
                    onClick={(event) => {
                        handleChange(event);
                        toggle();
                    }}
                >
                    {/* {chp.chapter} */}
                    <div className="flex flex-row gap-x-2 justify-center">
                        <div>
                            {chp.chapter}
                        </div>
                        {chp?.read && <img className="max-h-8 max-w-4" alt="check?" src={process.env.PUBLIC_URL + '/images/check.png'}></img>}    
                    </div>
                </button>
        );
    };

    
  
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
      <div className='flex flex-col relative w-3/4'>
        {open && <div
          className={clsx(
            'absolute min-w-20 w-full rounded-lg overflow-auto no-scrollbar bg-gray-400',
            'ease-in-out duration-300 z-10',
            'transform transition-all origin-bottom flex flex-col',
            {
              'max-h-60 -translate-y-[212px] visible': show,
              'max-h-0 translate-y-[25px] invisible': !show,
            }
          )}
        >
          <List
            height={1000} // Height of the dropdown
            itemCount={manhwa.chapters.length+1} // Total number of items
            itemSize={32} // Height of each item
            width="100%" // Width of the dropdown
            className="no-scrollbar"
            >
                {ChapterRow}
            </List>
        </div>}
        <label htmlFor="myDropdown" className="mb-2 text-sm font-medium">
               Select Chapter
        </label>
        <div
            onClick={() => toggle()}
            id="myDropdown"
            className='flex flex-row justify-center items-center text-xxs relative
             font-bold bg-gray-400 min-w-24 w-full text-white rounded-lg border-[2px]
             border-black min-h-10'
        >
          <span className='ml-auto text-center'>{ 
          selectedOption === "" ? "--Choose a Chapter--" : manhwa.chapters[Number(selectedOption)].chapter }</span>
          <img alt='<' 
            className={clsx(
              'transform transition-all max-h-4 ml-auto my-auto ',
              {
                'rotate-90' : show,
  
              }
            )}
            src={process.env.PUBLIC_URL + '/images/angleLeft.png'}/>
        </div>
  
      </div>
    )
  }
  