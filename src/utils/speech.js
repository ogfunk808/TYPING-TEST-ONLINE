// Web Speech API Voice Synthesis utility
// Provides Text-to-Speech support for pronunciation, letters, and results.

let synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
let currentVoice = null;
let voiceSettings = {
  pitch: 1.0,
  rate: 1.0,
  volume: 0.8
};

// Initialize voices and select a default English voice
export function getAvailableVoices() {
  if (!synth) return [];
  return synth.getVoices();
}

export function selectVoice(voiceName) {
  const voices = getAvailableVoices();
  const selected = voices.find(v => v.name === voiceName);
  if (selected) {
    currentVoice = selected;
    return true;
  }
  return false;
}

export function updateVoiceSettings(newSettings) {
  voiceSettings = { ...voiceSettings, ...newSettings };
}

// Pronounce text
export function speak(text, forceInterrupt = true) {
  if (!synth) return;
  
  if (forceInterrupt) {
    synth.cancel();
  }

  // Handle empty text or silent mode
  if (!text || text.trim() === "") return;

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Try to find a default English voice if none selected
  if (!currentVoice) {
    const voices = getAvailableVoices();
    // Prefer Google US English, otherwise any English voice
    currentVoice = voices.find(v => v.name.includes("Google US English") || v.name.includes("Microsoft Zira")) 
                || voices.find(v => v.lang.startsWith("en-")) 
                || voices[0];
  }

  if (currentVoice) {
    utterance.voice = currentVoice;
  }

  utterance.pitch = voiceSettings.pitch;
  utterance.rate = voiceSettings.rate;
  utterance.volume = voiceSettings.volume;

  synth.speak(utterance);
}

// Pronounce individual letters, mapping special keys or using spelling phonetic names
export function speakLetter(letter) {
  if (!letter) return;
  
  let textToSpeak = letter;
  
  // Translate punctuation for clearer pronunciation
  if (letter === ' ') textToSpeak = 'space';
  else if (letter === '.') textToSpeak = 'period';
  else if (letter === ',') textToSpeak = 'comma';
  else if (letter === '!') textToSpeak = 'exclamation';
  else if (letter === '?') textToSpeak = 'question mark';
  else if (letter === ';') textToSpeak = 'semicolon';
  else if (letter.length > 1) {
    // If it's a key name like Backspace, Enter, etc.
    if (letter === 'Backspace') textToSpeak = 'back';
    else return; // Ignore modifiers like Shift, Control
  }
  
  // Use a slightly higher pitch and faster rate for snappy letter feedback
  const oldRate = voiceSettings.rate;
  const oldPitch = voiceSettings.pitch;
  
  voiceSettings.rate = 1.3;
  voiceSettings.pitch = 1.15;
  
  speak(textToSpeak, true);
  
  voiceSettings.rate = oldRate;
  voiceSettings.pitch = oldPitch;
}

// Pronounce complete words
export function speakWord(word) {
  if (!word) return;
  // Clean punctuation from word for cleaner TTS speech
  const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g,"");
  speak(cleanWord, true);
}
