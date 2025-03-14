import { generate } from 'random-words'
import React, { createRef, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Menu } from './Menu'
import { TestContext } from '../context/TestContext'
import { ThemeContext } from '../context/ThemeContext'

export const TypingBox = () => {
    const [words, setWords] = useState<string[]>(generate({exactly: 44, minLength: 2}) as string[])
    const { testTime } = useContext(TestContext)!;
    const [countDown, setCD] = useState(testTime);
    const [testStart, setStart] = useState(false);
    const [testEnd, setEnd] = useState(false);
    const [currWordIndex, setCurrWordIndex] = useState(0);
    const [currCharIndex, setCurrCharIndex] = useState(0);
    const [correctChars, setCorrectChars] = useState(0);
    const [incorrectChars, setIncorrectChars] = useState(0);
    const [missedChars, setMissedChars] = useState(0);
    const [extraChars, setExtraChars] = useState(0);
    const [correctWords, setCorrectWords] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const wordsSpanRef = useMemo(() => {
        return Array(words.length).fill(0).map(_ => createRef<HTMLSpanElement>());
    }, [words]);

    const { theme } = useContext(ThemeContext)!

    const cursorLeft = 'animate-blinking1 border-l-2 border-white';
    const cursorRight = 'animate-blinking2 border-r-2 border-white';

    const focusInput = () => {
        if (inputRef.current) inputRef.current.focus();
    };

    const calcWPM = () => {
        return Math.round((correctChars / 5) / (testTime / 60));
    }

    const calcAcc = () => {
        return Math.round((correctWords/(currWordIndex+1)) * 100)
    }
    
    const startTimer = () => {
        const intervalID = setInterval(timer, 1000);

        function timer() {
            setCD(prev => {if (prev === 1) {setEnd(true); clearInterval(intervalID);}; return prev - 1;});

        }
    };

    useEffect(() => {
        focusInput();
        if(wordsSpanRef[0].current) {
           ( wordsSpanRef[0].current.childNodes[0] as HTMLElement).className = 'cursorLeft';
        }
    },[])

    
 
    useEffect(() => {
        setCD(testTime);
    }, [testTime]);




    const handleUserInput = (e: React.KeyboardEvent) => {

        if (!testStart) {
            startTimer();
            setStart(true);
        }

        const wordElement = wordsSpanRef[currWordIndex].current;
        if (wordElement) {
            const allCurrChars = wordElement.getElementsByTagName('span');
            if (e.key === ' ') {
                if (currCharIndex === 0) return;
                let correctCharsInWord = wordsSpanRef[currWordIndex].current!.querySelectorAll(`.${theme.value.correct}`);

                if (correctCharsInWord.length === allCurrChars.length) {
                    setCorrectWords(prev => prev + 1);
                }
                if (allCurrChars.length <= currCharIndex) {
                    allCurrChars[currCharIndex-1].classList.remove('cursorRight')
                }
                else {
                    allCurrChars[currCharIndex].classList.remove('cursorLeft')
                    setMissedChars(missedChars + (allCurrChars.length - currCharIndex));
                }

                if (currWordIndex < wordsSpanRef.length ) {
                        (wordsSpanRef[currWordIndex + 1].current!.childNodes[0] as HTMLElement).className = "cursorLeft";
                }
                setCurrWordIndex(prev => prev + 1);
                setCurrCharIndex(0);
                return;
            }

            if (e.key === 'Backspace') {
                if (currCharIndex !== 0) {
                    if (currCharIndex === allCurrChars.length) {
                        if (allCurrChars[currCharIndex - 1].className.includes('extra')) {
                            allCurrChars[currCharIndex - 1].remove();
                            allCurrChars[currCharIndex - 2].className += ' ' + "cursorRight";
                        }
                        else {
                            allCurrChars[currCharIndex - 1].className = "cursorLeft";
                        }
                    }
                    else {
                        allCurrChars[currCharIndex].className = '';
                        allCurrChars[currCharIndex - 1].className =  "cursorLeft";
                    }
                    setCurrCharIndex(prev => prev - 1);
                }

                if (currCharIndex === 0 &&  (currWordIndex !== 0 && 
                    wordsSpanRef[currWordIndex - 1].current?.querySelectorAll(`.${theme.value.wrong}`).length !== 0)) {
                        allCurrChars[currCharIndex].className = '';
                        const prevWordElem = wordsSpanRef[currWordIndex - 1];
                        const wrong = wordsSpanRef[currWordIndex - 1].current?.querySelectorAll(`.${theme.value.wrong}`).length;
                        const right = wordsSpanRef[currWordIndex - 1].current?.querySelectorAll(`.${theme.value.correct}`).length;
                        if (prevWordElem.current) {
                            const prevChars = prevWordElem.current.getElementsByTagName('span');
                            const chk = wrong! + right! === prevChars.length;
                            prevChars[chk ? wrong! + right! - 1 : wrong! + right!].className += chk ? " cursorRight" : " cursorLeft";
                            setCurrCharIndex(wrong! + right!);
                        }
                        setCurrWordIndex(prev => prev - 1);

                        return;
                }

                if (currCharIndex === 0 && currWordIndex !== 0) {
                    const prevChars = wordsSpanRef[currWordIndex -1].current?.querySelectorAll('span');
                    const wrong = wordsSpanRef[currWordIndex - 1].current?.querySelectorAll(`.${theme.value.wrong}`).length;
                    const right = wordsSpanRef[currWordIndex - 1].current?.querySelectorAll(`.${theme.value.correct}`).length;
                    console.log(right);
                    console.log(wrong);
                    console.log(currCharIndex);
                    console.log(prevChars?.length);
                    if (wrong! + right! !== prevChars?.length ) {
                        allCurrChars[currCharIndex].className = '';
                        prevChars![wrong! + right!].className += " cursorLeft";
                        setCurrCharIndex(Math.max(wrong!, right!));
                        setCurrWordIndex(prev => prev - 1);
                    }

                }

                return;

                // if(currCharIndex !== 0) {
                //     //in this case we know that currCharIndex === allCurrChars.length
                //     //in addition only works if word is an extra word
                //     console.log("first: ", allCurrChars.length);
                //     if (allCurrChars[currCharIndex - 1].className.includes('extra')) {
                //         allCurrChars[currCharIndex - 1].remove();
                //         allCurrChars[currCharIndex - 2].className += ' ' + cursorRight
                //     }
                //     console.log("currCharIndex: ", currCharIndex);
                //     // console.log("second: ", allCurrChars.length);
                //     allCurrChars[currCharIndex === allCurrChars.length ? currCharIndex - 1 : currCharIndex ].className = '';
                //     allCurrChars[currCharIndex - 1].className = cursorLeft;
                //     setCurrCharIndex(prev => prev - 1);
                // }
                // return;
            }

            if (currCharIndex === allCurrChars.length) {
                const newChar = document.createElement('span');
                newChar.innerText = e.key;
                newChar.className = `${theme.value.wrong} ${"cursorRight"} extra`;
                
                allCurrChars[currCharIndex-1].classList.remove('cursorRight');


                wordsSpanRef[currWordIndex].current!.append(newChar);
                setCurrCharIndex(prev => prev + 1);
                setExtraChars(prev => prev + 1);
                return;
            }

            if (e.key == allCurrChars[currCharIndex].innerText) {
                allCurrChars[currCharIndex].className = `${theme.value.correct}`
                setCorrectChars(prev => prev + 1);
            }
            else {
                allCurrChars[currCharIndex].className = `${theme.value.wrong}`
                setIncorrectChars(prev => prev + 1);
            }
            if (currCharIndex + 1 === allCurrChars.length) {
                allCurrChars[currCharIndex].className += ' ' + "cursorRight";
            } 
            else {
                allCurrChars[currCharIndex + 1].className = "cursorLeft";
            }
            
            setCurrCharIndex(prev => prev + 1);

        }
        
    }
    

    return (
        <div>
            <Menu countDown={countDown}></Menu>
            {testEnd ? <h1>Test Over</h1>  : <div className='block max-w-[1000px] h-[140px] mx-auto overflow-hidden' onClick={focusInput}>
                <div className='font-mono flex text-lg flex-wrap cursor-text select-none'>
                    {
                        words.map((word, i) => (
                            <span className='mx-2' key={i} ref={wordsSpanRef[i]}>
                                {word.split('').map((char, i2) => (
                                    <span key={i2}>{char}</span>
                                ))}
                            </span>
                        ))
                    }
                </div>

            </div>}
            <input
                ref={inputRef}
                type='text'
                className='opacity-0'
                onKeyDown={handleUserInput}
            />
        <div>
            WPM: {calcWPM()}
        </div>
        <div>
            Accurcacy: {calcAcc()}
        </div>
        </div>
    )
}