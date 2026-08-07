// Text generator utility for multiple categories and age levels

export const KIDS_WORDS = [
  "dog", "cat", "bird", "fish", "frog", "lion", "bear", "duck", "deer", "wolf",
  "blue", "red", "green", "pink", "warm", "cold", "happy", "smile", "laugh", "sing",
  "book", "tree", "leaf", "star", "moon", "sun", "rain", "snow", "wind", "cloud",
  "home", "play", "jump", "run", "walk", "ride", "swim", "fly", "draw", "read",
  "apple", "sweet", "milk", "bread", "cake", "game", "toy", "ball", "doll", "kite"
];

export const KIDS_SENTENCES = [
  "The happy dog runs fast.",
  "I like to read my green book.",
  "Look at the bright shining star.",
  "A blue bird sings in the tree.",
  "Can you paint a pretty red flower?",
  "We like to play with the big ball.",
  "The little fish swims in the water.",
  "A sleeping cat is soft and warm.",
  "Rain falls from the dark gray cloud.",
  "I eat a sweet red apple every day."
];

export const CLASSIC_WORDS = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "i",
  "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
  "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
  "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
  "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
  "people", "into", "year", "your", "good", "some", "could", "them", "see", "other",
  "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
  "back", "after", "use", "two", "how", "our", "work", "first", "well", "way",
  "even", "new", "want", "because", "any", "these", "give", "day", "most", "us"
];

export const FAMOUS_QUOTES = [
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
  "In the middle of difficulty lies opportunity. - Albert Einstein",
  "It is during our darkest moments that we must focus to see the light. - Aristotle",
  "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
  "Do not go where the path may lead, go instead where there is no path and leave a trail. - Ralph Waldo Emerson",
  "Believe you can and you're halfway there. - Theodore Roosevelt",
  "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment. - Ralph Waldo Emerson"
];

export const CODE_SNIPPETS = [
  "const calculateWpm = (chars, time) => Math.round((chars / 5) / (time / 60));",
  "document.addEventListener('keydown', (e) => { console.log(e.key); });",
  "const element = document.createElement('canvas'); const ctx = element.getContext('2d');",
  "function bubbleSort(arr) { for (let i = 0; i < arr.length; i++) { if (arr[i] > arr[i+1]) { swap(arr, i, i+1); } } }",
  "import React, { useState, useEffect, useRef } from 'react';",
  "export default function App() { return <div className='app'>Typiverse 3D</div>; }",
  "const response = await fetch('/api/scores'); const data = await response.json();"
];

export function getRandomWords(count = 30) {
  const result = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * CLASSIC_WORDS.length);
    result.push(CLASSIC_WORDS[randomIndex]);
  }
  return result;
}

export function getRandomKidsWords(count = 20) {
  const result = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * KIDS_WORDS.length);
    result.push(KIDS_WORDS[randomIndex]);
  }
  return result;
}

export function getRandomKidsSentence() {
  const index = Math.floor(Math.random() * KIDS_SENTENCES.length);
  return KIDS_SENTENCES[index];
}

export function getRandomQuote() {
  const index = Math.floor(Math.random() * FAMOUS_QUOTES.length);
  return FAMOUS_QUOTES[index];
}

export function getRandomCodeSnippet() {
  const index = Math.floor(Math.random() * CODE_SNIPPETS.length);
  return CODE_SNIPPETS[index];
}

export function getWordsForMode(mode, category) {
  if (mode === 'kids') {
    if (category === 'sentences') {
      return getRandomKidsSentence().split(' ');
    }
    return getRandomKidsWords(15);
  }
  
  // Classic/Pro modes
  switch (category) {
    case 'words':
      return getRandomWords(25);
    case 'quotes':
      return getRandomQuote().split(' ');
    case 'code':
      return getRandomCodeSnippet().split(' ');
    default:
      return getRandomWords(25);
  }
}
