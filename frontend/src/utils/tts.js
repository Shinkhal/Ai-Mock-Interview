export function speak(text, onStart = () => {}, onEnd = () => {}) {
  const synth = window.speechSynthesis;

  if (!synth) {
    console.warn("Speech synthesis not supported.");
    return;
  }

  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 1;
  utter.pitch = 1;

  utter.onstart = onStart;
  utter.onend = onEnd;

  synth.speak(utter);
}
