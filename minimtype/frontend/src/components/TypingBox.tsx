import { generate } from 'random-words'
import React, { createRef, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Menu } from './Menu'
import { TestContext } from '../context/TestContext'
import { ThemeContext } from '../context/ThemeContext'
import { Stats } from './Stats'
import { AuthContext } from '../context/AuthContext'
import { createTest } from '../services/tests'
import keyClickSound from '../assets/keyClickSound5.mp3';
import keyClickSound2 from '../assets/keyClickSound2.wav';

export const TypingBox = () => {
    const typingWordsLen = 400;
    const [words, setWords] = useState<string[]>(generate({exactly: typingWordsLen, minLength: 2}) as string[])
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
    const [totalChars, setTotalChars] = useState(0);
    const [correctCharsInWords, setCIW] = useState(0);
    const [allTypedWords, setTypedWords] = useState(0);
    const { theme } = useContext(ThemeContext)!
    const [oldTheme, setOldTheme] = useState(Object.values(theme.value));
    const [newTheme, setNewTheme] = useState(Object.values(theme.value));
    const [graphData, setGraphData] = useState<number[][]>([]);
    const [intervalID, setIntervalId] = useState<NodeJS.Timeout | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const soundRef = useRef(new Audio(keyClickSound));
    const maxWordLen = 32;
    const wordsSpanRef = useMemo(() => {
            return words.map(_ => createRef<HTMLSpanElement>());
        }, [words]);

    
    const { user } = useContext(AuthContext)!;

    const focusInput = () => {
        if (inputRef.current) inputRef.current.focus();
    };

    const calcWPM = () => {
        return Math.round((correctCharsInWords / 5) / (testTime / 60));
    };
    
    const calcRaw = () => {
        return Math.round((allTypedWords / 5) / (testTime / 60));
    };

    const calcAcc = () => {
        return Math.round(((correctChars)/(Math.max(totalChars, 1))) * 100)
    };
    

    const handleTestEnd = () => {
        const timeSet = new Set();
        const testInfo = { 
            user_email: user.userEmail ,
            wpm:  calcWPM(), 
            raw_wpm: calcRaw(), 
            characters: {
                correct_chars: correctChars,
                incorrect_chars: incorrectChars,
                missed_chars: missedChars,
                extra_chars: extraChars,
            },
            graph_data: graphData.filter(e => {
                if (!timeSet.has(e[0])) {
                    timeSet.add(e[0]);
                    return true;
                }
                return false;
            }), 
            accuracy: calcAcc(), 
            user_id: user.userId! };
        const validTest = () => {
            return testInfo.wpm >= 10 && testEnd;
        };
        if (validTest() && JSON.stringify(user) !== "{}") {
            console.log(JSON.stringify(user));
            createTest(testInfo).then(res => console.log(res) )
        }
        else {
            console.log("Test Invalid");
        }
    }

    const startTimer = () => {
        const intervalId = setInterval(timer, 1000);
        setIntervalId(intervalId);
        function timer() {
            setCD(cd => 
                {
                    setCIW(prev => {
                        setTypedWords(prev2 => {
                            setGraphData(gd => {
                                return [...gd, [
                                    testTime - cd + 1,
                                    (prev/5)/((testTime-cd + 1)/60),
                                    (prev2/5)/((testTime-cd + 1)/60),
                                ]];
                            });
                            return prev2;
                        })
                        return prev;
                    });
                    if (cd === 1) {
                        setEnd(true); 
                        clearInterval(intervalId);
                        }; 
                    return cd - 1;
                });
        };
    };


    const resetTest = () => {
        clearInterval(intervalID!);
        wordsSpanRef.forEach(ref => {
            const children = Array.from(ref.current?.childNodes || []);
            children.forEach(node => {
                if ((node as HTMLSpanElement).classList.contains("extra")) {
                    ref.current?.removeChild(node);
                }
                (node as HTMLSpanElement).className = "";
            });
        });
        
        setWords(generate({exactly: typingWordsLen, minLength: 2}) as string[]);
        setStart(false);
        setEnd(false);
        setCD(testTime);
        setCurrWordIndex(0);
        setCurrCharIndex(0);
        setCorrectChars(0);
        setIncorrectChars(0);
        setMissedChars(0);
        setExtraChars(0);
        setTotalChars(0);
        setCIW(0);
        setTypedWords(0);
        setGraphData([]);
    };

    const handleRestart = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            resetTest();
        }
    }


    useEffect(() => {
        focusInput();
        if(wordsSpanRef[0].current) {
           ( wordsSpanRef[0].current.childNodes[0] as HTMLElement).className = 'cursorLeft';
        }
    },[words])

    useEffect(() => {
        if (testEnd) {
            handleTestEnd();
        }
    }, [testEnd])



    useEffect(() => {
        if (testStart) {
            document.documentElement.style.setProperty(
                "--enable-animation",
                testStart ? 'unset' : 'none'
            );
        }
        if (testEnd) {
            document.documentElement.style.setProperty(
                "--enable-animation",
                testEnd ? 'none' : 'unset'
            );
        }
    }, [testStart, testEnd])

    useEffect(() => {
        setOldTheme(newTheme);
        setNewTheme(Object.values(theme.value));
        focusInput();
    }, [theme]);

    useEffect(() => {
        focusInput();
    }, [testTime])
    
    useEffect(() => {
        wordsSpanRef.forEach(elem => {
            if (!elem.current) return;

            elem.current.childNodes.forEach(node => {
                if (node instanceof HTMLElement) {
                    const classes = node.classList;
                    oldTheme.forEach((oldClass, i) => {
                        if (classes.contains(oldClass)) {
                            classes.remove(oldClass);
                            classes.add(newTheme[i]);
                        }
                    });
                }
            });
        });
    }, [newTheme]);

    
 
    useEffect(() => {
        setCD(testTime);
    }, [testTime]);

  
    useEffect(() => {
        const wordRef = wordsSpanRef[currWordIndex];
        if (wordRef.current) {
            wordRef.current.scrollIntoView({ behavior: "smooth", block:"center"});
        }
    },[currWordIndex])


    const handleUserInput = (e: React.KeyboardEvent) => {
        if ((e.altKey || e.ctrlKey) && e.key !== "") return;
        if (!/^[a-zA-Z0-9]$/.test(e.key) && !(e.key === 'Backspace' || e.key === ' ')) {
            return;
          }

        if (!testStart) {
            startTimer();
            setStart(true);
        }


        const wordElement = wordsSpanRef[currWordIndex].current;
        if (wordElement) {
            // if (soundRef.current) {
            //     soundRef.current.currentTime = 0;
            //     soundRef.current.play().catch(error => console.error("Audio play error: ", error));
            // }
            const soundRight = new Audio(keyClickSound);
            const soundWrong = new Audio(keyClickSound2);
            soundRight.volume = 0.1;
            soundRight.currentTime = 0;
            soundRight.currentTime = 0;
            soundWrong.volume = 0.1;
            soundWrong.currentTime = 0;
            soundWrong.currentTime = 0;
            const allCurrChars = wordElement.getElementsByTagName('span');
            if (allCurrChars.length === maxWordLen) return;
            if (e.key === ' ') {
                if (currCharIndex === 0) return;
                let correctLettersInWord = wordsSpanRef[currWordIndex].current!.querySelectorAll(`.${theme.value.correct}`);

                if (correctLettersInWord.length === allCurrChars.length) {
                    setCIW(prev => prev + 1 + allCurrChars.length);
                    setTypedWords(prev => prev + 1 + correctLettersInWord.length);
                }
                else {
                    setTypedWords(prev => prev + 1 + correctLettersInWord.length);
                }

                if (allCurrChars.length <= currCharIndex) {
                    allCurrChars[currCharIndex-1].classList.remove('cursorRight')
                }
                else {
                    allCurrChars[currCharIndex].classList.remove('cursorLeft')
                    setMissedChars(missedChars + (allCurrChars.length - currCharIndex));
                    soundWrong.play().catch(error => console.error("Audio error: ", error));
                }

                if (currWordIndex < wordsSpanRef.length ) {
                        (wordsSpanRef[currWordIndex + 1].current!.childNodes[0] as HTMLElement).className = "cursorLeft";
                }



                setCurrWordIndex(prev => prev + 1);
                setCurrCharIndex(0);

                return;
            }



            if (e.key === 'Backspace') {
                soundRight.play().catch(error => console.error("Audio error: ", error));
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
                   
                    if (wrong! + right! !== prevChars?.length ) {
                        allCurrChars[currCharIndex].className = '';
                        prevChars![wrong! + right!].className += " cursorLeft";
                        setCurrCharIndex(Math.max(wrong!, right!));
                        setCurrWordIndex(prev => prev - 1);
                    }

                }

                return;

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
                soundRight.play().catch(error => console.error("Audio error: ", error));
            }
            else {
                allCurrChars[currCharIndex].className = `${theme.value.wrong}`
                setIncorrectChars(prev => prev + 1);
                soundWrong.play().catch(error => console.error("Audio error: ", error));
            }
            if (currCharIndex + 1 === allCurrChars.length) {
                allCurrChars[currCharIndex].className += ' ' + "cursorRight";
            } 
            else {
                allCurrChars[currCharIndex + 1].className = "cursorLeft";
            }
            
            setTotalChars(prev => prev + 1);
            setCurrCharIndex(prev => prev + 1);

        }
        
    }
    

    return (
        <div className='' onKeyDown={handleRestart}>
            <Menu countDown={countDown} restart={resetTest}></Menu>
            {testEnd ? <Stats stats={{raw: calcRaw(), wpm: calcWPM(), accuracy: calcAcc(), correctChars, incorrectChars, missedChars, extraChars, graphData}}/> 
            : <div className='block max-w-[1000px] h-[140px] mx-auto overflow-hidden' onClick={focusInput}>
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
      
        </div>
    )
}