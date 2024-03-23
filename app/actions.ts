export function talk(text: string) {
    const message = new SpeechSynthesisUtterance();

    alert("Hi")

// set the text to be spoken
    message.text = text;

    // create an instance of the speech synthesis object
    const speechSynthesis = window.speechSynthesis;

    // start speaking
    speechSynthesis.speak(message);
  }