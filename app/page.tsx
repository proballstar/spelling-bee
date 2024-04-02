"use client"

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {

  const [word, setWord] = useState<string>("")
  const [status, setStatus] = useState<string>("")
  const [guess, setGuess] = useState<string>("")
  const [guesses, setGuesses] = useState<number>(0)
  const [s, setS] = useState<SpeechSynthesis>()
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null)
  const [wordInfo, setWordInfo] = useState<any>({})

  function talk(text: string) {
    const message = new SpeechSynthesisUtterance();
// set the text to be spoken
    message.voice = voice;
    message.text = text;

    // start speaking
    s?.speak(message);
    alert(message.voice)
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
            setWordInfo(d)
          })
      })
  }

  useEffect(() => {
    setS(window.speechSynthesis!)
    genWord()
  }, [])

  async function guessWord() {
    if(guesses < 3) {
      if(guess === word) {
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
      alert(voice?.name + " " + ame)
  }

  function handleDef() {
    if(Array.isArray(wordInfo) && wordInfo[0]["shortdef"]) {
      let words = wordInfo[0]["shortdef"].join("; another definition is,  ")

      const message = new SpeechSynthesisUtterance();
  // set the text to be spoken
      message.voice = voice;
      message.text = words;

      // start speaking
      s?.speak(message);
      alert(message.voice)
    }
  }
  
  function ety() {
    if(Array.isArray(wordInfo)) {
      let sen = ""
      alert(sen)
      wordInfo[0]["et"].forEach((root: any) => {
        alert(root)
        sen = sen + root[1] + " "
      })
      alert(sen)

      const message = new SpeechSynthesisUtterance();
  // set the text to be spoken
      message.voice = voice;
      message.text = sen;

      // start speaking
      s?.speak(message);
      alert(message.voice)
  }}

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex space-y-4 flex-col items-center">
        <h1 className="text-4xl font-bold text-center">{status}</h1>
        <div className="space-x-5 py-4 flex flex-row">
          <button className="bg-green-500 rounded-xl text-white px-4 py-2" onClick={() => talk(word)}>Pronounce</button>
          <button className="text-green-500 rounded-xl border border-green-500 px-4 py-2" onClick={() => handleDef()}>Definition</button>
          <button className="text-green-500 rounded-xl border border-green-500 px-4 py-2" onClick={() => ety()}>Etymology</button>
        </div>
        <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/6">
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
