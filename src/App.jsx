import React, { useState, useEffect, useRef } from 'react';
import { Settings, Trophy, RotateCcw, Volume2, VolumeX, Keyboard, Compass, HelpCircle } from 'lucide-react';
import GameCanvas from './components/GameCanvas';
import TypewriterCanvas from './components/TypewriterCanvas';
import StatsDashboard from './components/StatsDashboard';
import SettingsPanel from './components/SettingsPanel';
import Leaderboard from './components/Leaderboard';
import AdSponsor from './components/AdSponsor';
import VirtualKeyboard from './components/VirtualKeyboard';
import PrivacyPolicy from './components/PrivacyPolicy';
import HowToUseModal from './components/HowToUseModal';
import AdSenseBlock from './components/AdSenseBlock';
import { getWordsForMode } from './utils/textGenerator';
import { playSound } from './utils/audioSynth';
import { speak, speakLetter, speakWord, selectVoice, updateVoiceSettings } from './utils/speech';

const DEFAULT_SETTINGS = {
  ageMode: 'classic', // classic | kids | senior
  category: 'words',   // words | quotes | code | sentences (kids only)
  duration: 30,
  soundOn: true,
  speakLetters: false,
  speakWords: false,
  voiceName: '',
  voicePitch: 1.0,
  voiceRate: 1.0
};

export default function App() {
  const [activeView, setActiveView] = useState('3d-space'); // 3d-space | 3d-typewriter
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('typiverse_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [words, setWords] = useState([]);
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [typedWord, setTypedWord] = useState('');
  
  // Game metrics
  const [totalCorrectChars, setTotalCorrectChars] = useState(0);
  const [totalTypedChars, setTotalTypedChars] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  
  // Timers and state
  const [timeLeft, setTimeLeft] = useState(settings.duration);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Trigger animations
  const [laserTrigger, setLaserTrigger] = useState(0);
  const [lastKeyPressed, setLastKeyPressed] = useState('');

  // Modals
  const [showSettings, setShowSettings] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showHowToUse, setShowHowToUse] = useState(false);
  const [newScoreRecord, setNewScoreRecord] = useState(null);

  // Caret alignment refs
  const inputRef = useRef(null);
  const wordsContainerRef = useRef(null);
  const timerRef = useRef(null);

  // Load voices and apply saved configurations
  useEffect(() => {
    localStorage.setItem('typiverse_settings', JSON.stringify(settings));
    // Apply voice configurations to speech module
    selectVoice(settings.voiceName);
    updateVoiceSettings({
      pitch: settings.voicePitch,
      rate: settings.voiceRate
    });
  }, [settings]);



  // Restart / Reset typing test
  const resetTest = () => {
    clearInterval(timerRef.current);
    setIsPlaying(false);
    setIsFinished(false);
    setTimeLeft(settings.duration);
    setTimeElapsed(0);
    
    // Choose appropriate category for kids vs others
    const cat = settings.ageMode === 'kids' ? 'sentences' : settings.category;
    const wordList = getWordsForMode(settings.ageMode, cat);
    setWords(wordList);
    
    setCurrentWordIdx(0);
    setTypedWord('');
    setTotalCorrectChars(0);
    setTotalTypedChars(0);
    setStreak(0);
    setBestStreak(0);
    setNewScoreRecord(null);

    // Speak initial instruction for kids
    if (settings.ageMode === 'kids') {
      speak("Let's play typing! Click here and type the words.", true);
    }

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Run on mount or when mode/category changes
  useEffect(() => {
    resetTest();
    return () => clearInterval(timerRef.current);
  }, [settings.ageMode, settings.category, settings.duration]);

  // Game countdown timer logic
  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            finishTest();
            return 0;
          }
          return prev - 1;
        });
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, timeLeft]);

  // End of test
  const finishTest = () => {
    setIsPlaying(false);
    setIsFinished(true);
    
    const finalWpm = calculateWpm();
    const finalAcc = calculateAccuracy();

    if (settings.soundOn) playSound.success();

    // Voice announcement of the final scores
    let announcement = `Test complete! You typed at ${finalWpm} words per minute with ${finalAcc} percent accuracy.`;
    if (settings.ageMode === 'kids') {
      announcement = `Great job! You typed ${finalWpm} words per minute. That is awesome!`;
    }
    speak(announcement, true);

    // Request player name for leaderboard record
    setTimeout(() => {
      const name = prompt(
        settings.ageMode === 'kids' 
          ? "🎉 Super! Enter your name for the high scores wall:" 
          : "🏆 Test complete! Enter your name to submit to the leaderboard:",
        "Guest Player"
      );
      if (name) {
        const today = new Date();
        const dateStr = today.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        setNewScoreRecord({
          name: name.substring(0, 15),
          wpm: finalWpm,
          accuracy: finalAcc,
          ageMode: settings.ageMode,
          date: dateStr
        });
        setShowLeaderboard(true);
      }
    }, 600);
  };

  // Live calculations
  const calculateWpm = () => {
    if (timeElapsed === 0) return 0;
    // Standard typing WPM: (correct characters / 5) / minutes elapsed
    const mins = timeElapsed / 60;
    return Math.round((totalCorrectChars / 5) / mins);
  };

  const calculateAccuracy = () => {
    if (totalTypedChars === 0) return 100;
    return Math.round((totalCorrectChars / totalTypedChars) * 100);
  };

  // Keyboard inputs capture handler
  const handleKeyDown = (e) => {
    // Ignore control hotkeys
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    
    // Auto start game on first valid keypress
    if (!isPlaying && !isFinished && e.key.length === 1) {
      setIsPlaying(true);
    }

    const currentWord = words[currentWordIdx] || '';
    setLastKeyPressed(e.key);

    // Backspace logic
    if (e.key === 'Backspace') {
      if (settings.soundOn) playSound.click(0.85); // lower pitch click
      if (settings.speakLetters) speakLetter('Backspace');
      
      if (typedWord.length > 0) {
        setTypedWord((prev) => prev.slice(0, -1));
        
        // Remove from count history (only subtract from correct keys if we are reducing a correct sequence)
        const backspacedChar = typedWord[typedWord.length - 1];
        const isCharCorrect = backspacedChar === currentWord[typedWord.length - 1];
        if (isCharCorrect) {
          setTotalCorrectChars((prev) => Math.max(0, prev - 1));
        }
        setTotalTypedChars((prev) => Math.max(0, prev - 1));
        setStreak((prev) => Math.max(0, prev - 1));
      }
      return;
    }

    // Spacebar - submits word
    if (e.key === ' ') {
      e.preventDefault();
      if (settings.soundOn) playSound.spacebar();
      
      // Speak final word if TTS enabled
      if (settings.speakWords) {
        speakWord(currentWord);
      }

      // Check word correct or not
      const isWordFullyCorrect = typedWord === currentWord;
      
      if (isWordFullyCorrect) {
        // Laser fire animation and laser blast audio
        setLaserTrigger((prev) => prev + 1);
        if (settings.soundOn) playSound.laser();
        
        // Add space char to correct count
        setTotalCorrectChars((prev) => prev + 1);
      } else {
        if (settings.soundOn) playSound.error();
      }

      setTotalTypedChars((prev) => prev + 1);

      // Move to next word, or end if last word
      if (currentWordIdx + 1 >= words.length) {
        finishTest();
      } else {
        setCurrentWordIdx((prev) => prev + 1);
        setTypedWord('');
      }
      return;
    }

    // Single character typing logic
    if (e.key.length === 1) {
      setTotalTypedChars((prev) => prev + 1);
      
      const expectedChar = currentWord[typedWord.length];
      const isCorrect = e.key === expectedChar;

      // Speak letters
      if (settings.speakLetters) {
        speakLetter(e.key);
      }

      if (isCorrect) {
        setTypedWord((prev) => prev + e.key);
        setTotalCorrectChars((prev) => prev + 1);
        setStreak((prev) => {
          const nextStreak = prev + 1;
          if (nextStreak > bestStreak) setBestStreak(nextStreak);
          return nextStreak;
        });
        
        // Sound feedback: standard mechanical keypress click
        if (settings.soundOn) {
          const pitch = 0.95 + Math.random() * 0.15; // subtle pitch randomness for realism
          playSound.click(pitch);
        }

        // Trigger laser/audio synthesis for quick feedback during streaks
        if (streak > 0 && streak % 10 === 0 && settings.soundOn) {
          playSound.success();
        }

        // Auto advance on correct space when user types the last letter + space is automatically added (for kids helper)
        if (settings.ageMode === 'kids' && typedWord.length + 1 === currentWord.length) {
          // Speak completed word for child feedback
          if (settings.speakWords) {
            setTimeout(() => speakWord(currentWord), 100);
          }
          setTimeout(() => {
            setLaserTrigger((prev) => prev + 1);
            if (settings.soundOn) {
              playSound.laser();
              playSound.success();
            }
            setTotalCorrectChars((prev) => prev + 1); // implicit space
            
            if (currentWordIdx + 1 >= words.length) {
              finishTest();
            } else {
              setCurrentWordIdx((prev) => prev + 1);
              setTypedWord('');
            }
          }, 200);
        }
      } else {
        // Incorrect character typed
        setStreak(0);
        if (settings.soundOn) playSound.error();
        // Still add character so user sees the mistake and can backspace
        if (typedWord.length < currentWord.length + 5) {
          setTypedWord((prev) => prev + e.key);
        }
      }
    }
  };

  const currentWpm = calculateWpm();
  const currentAccuracy = calculateAccuracy();

  // Find next character that needs to be typed for Virtual Keyboard highlights
  const currentTargetWord = words[currentWordIdx] || "";
  const nextCharNeeded = typedWord.length < currentTargetWord.length 
    ? currentTargetWord[typedWord.length] 
    : " "; // space if current word is completed

  return (
    <div className={`app-container theme-${settings.ageMode}`}>
      {/* 3D background canvas overlay */}
      {activeView === '3d-space' ? (
        <GameCanvas 
          wpm={currentWpm} 
          streak={streak} 
          isCorrect={true} 
          laserTrigger={laserTrigger} 
        />
      ) : (
        <TypewriterCanvas lastKeyPressed={lastKeyPressed} />
      )}

      {/* Header section */}
      <header className="header">
        <div className="logo" style={{ display: 'flex', alignItems: 'center' }}>
          <svg className="logo-icon" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <defs>
              <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--color-cyan)" />
                <stop offset="50%" stopColor="var(--color-primary)" />
                <stop offset="100%" stopColor="var(--color-pink)" />
              </linearGradient>
            </defs>
            <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3z"/>
            <path d="M6 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3z"/>
            <path d="M12 8v8"/>
            <path d="M9 12h6"/>
          </svg>
          Typiverse 3D
        </div>

        {/* Floating View Selectors & Controls */}
        <div className="header-controls">
          <div className="view-selector">
            <button 
              className={`view-btn ${activeView === '3d-space' ? 'active' : ''}`}
              onClick={() => {
                if (settings.soundOn) playSound.click();
                setActiveView('3d-space');
              }}
            >
              <Compass size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
              Space Arcade
            </button>
            <button 
              className={`view-btn ${activeView === '3d-typewriter' ? 'active' : ''}`}
              onClick={() => {
                if (settings.soundOn) playSound.click();
                setActiveView('3d-typewriter');
              }}
            >
              <Keyboard size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
              Retro Typewriter
            </button>
          </div>

          <button 
            className="icon-btn active"
            onClick={() => {
              const updatedSound = !settings.soundOn;
              setSettings(prev => ({ ...prev, soundOn: updatedSound }));
              if (updatedSound) {
                // Initialize audio context
                playSound.click();
              }
            }}
          >
            {settings.soundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>

          <button className="icon-btn" onClick={() => setShowHowToUse(true)} title="How to Use Guide">
            <HelpCircle size={20} />
          </button>

          <button className="icon-btn" onClick={() => setShowLeaderboard(true)} title="Leaderboard">
            <Trophy size={20} />
          </button>

          <button className="icon-btn" onClick={() => setShowSettings(true)}>
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* Main interactive typing box */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 1 }}>
        <div className="typing-box glass-panel" onClick={() => inputRef.current && inputRef.current.focus()}>
          
          <StatsDashboard 
            wpm={currentWpm} 
            accuracy={currentAccuracy} 
            streak={streak} 
            timeLeft={timeLeft}
            activeMode={settings.ageMode}
          />

          {/* Hidden input to capture browser keypresses on both desktop and mobile devices */}
          <input
            ref={inputRef}
            type="text"
            className="hidden-input"
            value=""
            onChange={() => {}} // Controlled dummy handler
            onKeyDown={handleKeyDown}
            autoFocus
          />

          {/* Target typing text words container */}
          <div ref={wordsContainerRef} className="words-container">
            {words.map((word, wordIdx) => {
              const isCurrent = wordIdx === currentWordIdx;
              const isCompleted = wordIdx < currentWordIdx;
              
              let wordClass = "word";
              if (isCurrent) wordClass += " active";
              if (isCompleted) wordClass += " completed";

              return (
                <span key={wordIdx} className={wordClass}>
                  {/* Blinking cursor caret */}
                  {isCurrent && (
                    <span 
                      className="caret" 
                      style={{ 
                        left: `${typedWord.length * 0.6}em`,
                        height: '1.25em',
                        top: '0.15em'
                      }} 
                    />
                  )}
                  {word.split('').map((char, charIdx) => {
                    let charClass = "letter";
                    if (isCompleted) {
                      charClass += " correct";
                    } else if (isCurrent) {
                      if (charIdx < typedWord.length) {
                        const isCorrect = typedWord[charIdx] === char;
                        charClass += isCorrect ? " correct" : " incorrect";
                      }
                    }
                    return (
                      <span key={charIdx} className={charClass}>
                        {char}
                      </span>
                    );
                  })}
                  
                  {/* Extra characters typed past word length */}
                  {isCurrent && typedWord.length > word.length && (
                    typedWord.substring(word.length).split('').map((char, charIdx) => (
                      <span key={charIdx + word.length} className="letter incorrect">
                        {char}
                      </span>
                    ))
                  )}
                </span>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button className="button button-cyan" onClick={resetTest}>
              <RotateCcw size={16} />
              Restart Test
            </button>
          </div>
        </div>

        {/* Virtual Keyboard visual guide */}
        <VirtualKeyboard nextChar={nextCharNeeded} lastKeyPressed={lastKeyPressed} />

        {/* Sponsor/Ad Section */}
        <AdSponsor soundOn={settings.soundOn} />

        {/* Google AdSense Area */}
        <AdSenseBlock />
      </main>

      {/* Footer credits */}
      <footer style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '1.5rem', zIndex: 1 }}>
        <p>
          © 2026 Typiverse 3D. Sleek WebGL visuals, voice synth assistance, and mechanical clicks for all age typists.
          <button 
            className="view-btn" 
            onClick={() => setShowHowToUse(true)} 
            style={{ background: 'transparent', border: 'none', color: 'var(--color-cyan)', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.75rem', marginLeft: '10px' }}
          >
            How to Use
          </button>
          <button 
            className="view-btn" 
            onClick={() => setShowPrivacy(true)} 
            style={{ background: 'transparent', border: 'none', color: 'var(--color-primary)', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.75rem', marginLeft: '10px' }}
          >
            Privacy Policy
          </button>
        </p>
      </footer>

      {/* Settings Modal */}
      <SettingsPanel
        settings={settings}
        onUpdateSettings={(newSet) => setSettings((prev) => ({ ...prev, ...newSet }))}
        isOpen={showSettings}
        onClose={() => {
          setShowSettings(false);
          if (inputRef.current) inputRef.current.focus();
        }}
      />

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <Leaderboard 
          newScoreRecord={newScoreRecord} 
          onClose={() => {
            setShowLeaderboard(false);
            setNewScoreRecord(null);
            resetTest();
          }} 
        />
      )}

      {/* Privacy Policy Modal */}
      <PrivacyPolicy isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />

      {/* How to Use Guide Modal */}
      <HowToUseModal isOpen={showHowToUse} onClose={() => setShowHowToUse(false)} />
    </div>
  );
}
