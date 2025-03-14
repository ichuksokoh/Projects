import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";


const paragraph = `A plant is one of the most important living things that develop
on the earth and is made up of stems, leaves, roots, and so on. Parts of Plants:
The part of the plant that developed beneath the soil is referred to as a root and the part
that grows outside of the soil is known as the shoot. the shoot consists of stems,
branches, leaves, fruits, and flowers. Plants are made up of six main parts:
roots, stems, leaves, flowers, fruits, and seeds.`;

export default function Practice() {

    const maxTime = 60;
    const [timeLeft, setTime] = useState(maxTime);
    const [mistakes, setMistakes] = useState(0);
    const [WPM, setWPM] = useState(0);
    const [CPM, setCPM] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [correct, setCorrect] = useState<(boolean | null)[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const charRefs = useRef<(HTMLSpanElement | null)[]>([]);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
            setCorrect(Array(charRefs.current.length).fill(null));
        }
    }, [])

    useEffect(() => {
        let interval: number = -1;
        if (isTyping && timeLeft > 0) {
            interval = setInterval(() => {
                setTime(prev => prev - 1);
                let correctChars = charIndex - mistakes;
                let totalTime = maxTime - timeLeft;

                let cpm = correctChars * (60 / totalTime);
                cpm = cpm < 0 || !cpm || cpm === Infinity ? 0 : cpm;
                setCPM(cpm);

                let wpm = Math.round((correctChars / 5 / totalTime) * 60);
                wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
                setWPM(wpm);
                
            }, 1000);

        }
        else if (timeLeft === 0) {
            clearInterval(interval);
            setIsTyping(false);
        }

        return () => {
            clearInterval(interval);
        }
    }, [isTyping, timeLeft])


    const resetTest = () => {
        setIsTyping(false);
        setTime(maxTime);
        setCharIndex(0);
        setMistakes(0);
        setCPM(0);
        setWPM(0);
        setCorrect(Array(charRefs.current.length).fill(null));
        if (inputRef.current) {
            inputRef.current.focus();
        }
            
    }


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const chars = charRefs.current;
        let currChar = charRefs.current[charIndex];
        let typedChar = e.target.value.slice(-1);
        if (charIndex < chars.length && timeLeft > 0) {
            if(!isTyping) { 
                setIsTyping(true);
            }

            if (typedChar === currChar?.textContent) {
                setCharIndex(prev => prev + 1);
                correct[charIndex] = true
            }
            else {
                setCharIndex(prev => prev + 1);
                setMistakes(prev => prev + 1);
                correct[charIndex] = false;
            }
            if (charIndex === chars.length - 1) setIsTyping(false);
        }
        else {
            setIsTyping(false);
        }
    }

    return (
        <div className="flex flex-col justify-center items-center w-screen h-screen bg-gray-700 font-bold text-white">
            <div className="max-w-2xl m-5 rounded-lg border-2 border-sky-700 bg-white text-black shadow-blue-500 shadow-md p-4 select-none">
                <div className="mb-2">
                    <input className="opacity-0 -z-999 absolute" ref={inputRef} onChange={handleChange}/>
                    {
                        paragraph.split('').map((char, index) => (
                            <span key={index} className={clsx(
                                {
                                    'border-b-2 border-sky-400' : index === charIndex,
                                    'bg-green-300' : correct[index],
                                    'bg-red-300' : !correct[index] &&  correct[index] !== null
                                }
                            )} ref={(e) => charRefs.current[index] = e}
                            >{char}</span>
                        ))
                    }
                </div>
            <div className="flex flex-row w-full justify-center items-center gap-x-20 border-t-2 pt-2">
                <p>Time Left: <strong>{timeLeft}</strong></p>
                <p>Mistakes: <strong>{mistakes}</strong></p>
                <p>WPM: <strong>{WPM}</strong></p>
                <button className="w-30 h-10 text-white" onClick={resetTest}>Try Again</button>
            </div>
            </div>
            <span className="text-5xl">
                Welcome to typing page
            </span>
        </div>
    )
}