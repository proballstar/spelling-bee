"use client"

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {

  const [word, setWord] = useState<string>("")
  const [status, setStatus] = useState<string>("")
  const [guess, setGuess] = useState<string>("")
  const [guesses, setGuesses] = useState<number>(0)

  function talk(text: string) {
    const message = new SpeechSynthesisUtterance();
// set the text to be spoken
    message.text = text;

    // create an instance of the speech synthesis object
    const speechSynthesis = window.speechSynthesis;

    // start speaking
    speechSynthesis.speak(message);
  }

  function genWord() {
    fetch("https://random-word-api.herokuapp.com/word")
      .then(res => res.json())
      .then(data => {
        setWord(data[0])
        setStatus("")
        setGuesses(0)
        setGuess("")
      })
  }

  useEffect(() => {
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

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex space-y-4 flex-col items-center">
        <h1 className="text-4xl font-bold text-center">{status}</h1>
        <div className="space-x-5 py-4 flex flex-row">
          <button className="bg-green-500 rounded-xl text-white px-4 py-2" onClick={() => talk(word)}>Pronounce</button>
          <button className="text-green-500 rounded-xl border border-green-500 px-4 py-2">Definition</button>
        </div>
        <input className="outline-none bg-transparent border-2 border-blue-500 px-6 py-2 rounded-2xl" value={guess} onChange={(e) => setGuess(e.target.value)} placeholder="Type your guess here"  />
        <button className="bg-blue-500 rounded-xl text-white px-4 py-2" onClick={() => void guessWord()}>Check</button>
      </div>
    </main>
  );
}
