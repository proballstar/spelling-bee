"use client"

import { useEffect, useState } from "react";
import { APIInterface, handleAPIResult } from "./lib/handleWords";



export default function Home() {

  const [word, setWord] = useState<string>("")
  const [status, setStatus] = useState<string>("")
  const [guess, setGuess] = useState<string>("")
  const [guesses, setGuesses] = useState<number>(0)
  const [s, setS] = useState<SpeechSynthesis>()
  const [d, setD] = useState<any>([])
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null)
  const [auto, setAuto] = useState<boolean>(false)
  const [wordInfo, setWordInfo] = useState<APIInterface>({
    definition: {
      value: "Not available yet...",
      exist: false
    },
    etymology: {
      value: "Not available yet...",
      exist: false
    }
  })

  function speak(text: string) {
    const message = new SpeechSynthesisUtterance();
    message.text = text;
    message.voice = voice;
    s?.speak(message);
  }

  function genWord() {
    fetch("https://random-word-api.herokuapp.com/word")
      .then(res => res.json())
      .then(data => {
        setWord(data[0])
        setStatus("")
        setGuesses(0)
        setGuess("")
        fetch(`https://dictionaryapi.com/api/v3/references/collegiate/json/${data}?key=57d7fb45-77d0-4842-9080-edd955c35b82`)
          .then(res => res.json())
          .then(d => {
            if(d[0]) {
              setD(d)
            }
          })
      })
  }

  useEffect(() => {
    setS(window.speechSynthesis!)
    genWord()
  }, [])

  useEffect(() => {
    setWordInfo(handleAPIResult(d))
  }, [d])

  async function guessWord() {
    if(guess.toLowerCase() === word.toLowerCase()) {
      setStatus("Correct")
      await new Promise(r => setTimeout(r, 5000));
      genWord()
    } else {
      if(guesses < 2) {
        setStatus("Incorrect")
        setGuesses(p => p + 1)
      } else {
        setStatus("Incorrect, the word was " + word)
        if(auto) {
          await new Promise(r => setTimeout(r, 10000));
          genWord()
        } else {
          setStatus("Incorrect, the word was " + word + ". Please click next to continue.")
       }
       setGuesses(p => p + 1)
    }
  }
}
  
  function handleVoiceSelection(ame: string) {
      const voices = window.speechSynthesis.getVoices()
      const voice = voices.find(v => v.name == ame)
      if (!voice) return;
      setVoice(voice)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex space-y-4 flex-col items-center">
        <h1 className="text-4xl font-bold text-center">{status}</h1>
        <h2 className="text-2xl font-semibold text-center">{3-guesses} {guesses == 2 ? "guess" : "guesses"} left | {auto ? "Auto" : "User"}</h2>
        <div className="space-x-5 py-4 flex flex-row">
          <button 
            className="bg-green-500 rounded-xl text-white px-4 py-2" 
            onClick={() => {
              speak(word)
            }}
          >Pronounce
          </button>
          
        <button 
          className={`text-green-500 rounded-xl border border-green-500 px-4 py-2 ${wordInfo.definition.exist ? "" : "opacity-50 cursor-not-allowed"}`}
          onClick={() => {
            speak(wordInfo.definition.value) 
          }}
        >
            Definition
        </button>
          
          
          <button 
            className={`text-green-500 rounded-xl border border-green-500 px-4 py-2" ${wordInfo.etymology.exist ? "" : "opacity-50 cursor-not-allowed"} `}
            onClick={() => {
              speak(wordInfo.etymology.value)
            }}
          >
            Etymology
          </button>
          <button 
              className="text-green-500 rounded-xl border border-green-500 px-4 py-2" 
              onClick={async () => {
                genWord()
                setStatus("Getting new word...")
                await new Promise(r => setTimeout(r, 5000));
                setStatus("")
              }}
            >
            Next Word
          </button>
        </div>
        <div>
        <label
              className="inline-block pl-[0.15rem] hover:cursor-pointer"
              htmlFor="flexSwitchCheckDefault"
          >user</label>
          <input
              className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-primary dark:checked:after:bg-primary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
              type="checkbox"
              role="switch"
              id="flexSwitchCheckDefault" 
              onChange={(e) => {
                setAuto(prev => !prev)
              }}
          />
          <label
              className="inline-block pl-[0.15rem] hover:cursor-pointer"
              htmlFor="flexSwitchCheckDefault"
          >auto</label>
      </div>
        <div className="w-full">
          Voice: 
          <select className="w-full h-10 pl-3 pr-6 text-base placeholder-gray-600 border rounded-lg appearance-none focus:shadow-outline" onChange={(e) => handleVoiceSelection(e.target.value)}>
            {s?.getVoices()?.map((voice) => (
              <option value={voice.name}>{voice.name}</option>
            ))}
          </select>
        </div>
        <input className="opacity-100 focus:opacity-80 outline-none bg-transparent border-2 border-blue-500 px-6 py-2 rounded-2xl" value={guess} onChange={(e) => setGuess(e.target.value)} placeholder="Type your guess here"  />
        <button className="bg-blue-500 rounded-xl text-white px-4 py-2" onClick={() => void guessWord()}>Check</button>
      </div>
    </main>
  );
}
