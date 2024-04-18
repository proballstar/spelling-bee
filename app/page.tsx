"use client"

import Image from "next/image";
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
            alert(d)
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
    if(guesses < 3) {
      if(guess.toLowerCase() === word.toLowerCase()) {
        setStatus("Correct")
        await new Promise(r => setTimeout(r, 5000));
        genWord()
      } else {
        setStatus("Incorrect")
        setGuesses(p => p + 1)
      }
    } else {
      setStatus("Incorrect, the word was " + word)
      await new Promise(r => setTimeout(r, 10000));
      genWord()
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
        <div className="space-x-5 py-4 flex flex-row">
          <button 
            className="bg-green-500 rounded-xl text-white px-4 py-2" 
            onClick={() => {
              speak(word)
            }}
          >Pronounce
          </button>
          <button 
            className="text-green-500 rounded-xl border border-green-500 px-4 py-2" 
            onClick={() => {
              speak(wordInfo.definition.value)
            
            }}
          >
              Definition
          </button>
          <button 
            className="text-green-500 rounded-xl border border-green-500 px-4 py-2" 
            onClick={() => {
              speak(wordInfo.etymology.value)
            }}
          >
            Etymology
          </button>
        </div>
        <div className="w-full">
          <select className="w-full h-10 pl-3 pr-6 text-base placeholder-gray-600 border rounded-lg appearance-none focus:shadow-outline" onChange={(e) => handleVoiceSelection(e.target.value)}>
            {s?.getVoices()?.map((voice) => (
              <option value={voice.name}>{voice.name}</option>
            ))}
          </select>
        </div>
        <input className="outline-none bg-transparent border-2 border-blue-500 px-6 py-2 rounded-2xl" value={guess} onChange={(e) => setGuess(e.target.value)} placeholder="Type your guess here"  />
        <button className="bg-blue-500 rounded-xl text-white px-4 py-2" onClick={() => void guessWord()}>Check</button>
      </div>
    </main>
  );
}
