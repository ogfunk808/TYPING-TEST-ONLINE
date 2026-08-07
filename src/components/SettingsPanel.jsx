import React, { useEffect, useState } from 'react';
import { getAvailableVoices, selectVoice, updateVoiceSettings } from '../utils/speech';
import { Volume2, VolumeX, Eye, Sparkles } from 'lucide-react';

export default function SettingsPanel({
  settings,
  onUpdateSettings,
  isOpen,
  onClose
}) {
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    // Populate Speech Voices
    const loadVoices = () => {
      const vList = getAvailableVoices();
      setVoices(vList.filter(v => v.lang.startsWith('en')));
    };

    loadVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  if (!isOpen) return null;

  const handleVoiceChange = (e) => {
    selectVoice(e.target.value);
    onUpdateSettings({ voiceName: e.target.value });
  };

  const handleSliderChange = (key, value) => {
    updateVoiceSettings({ [key]: parseFloat(value) });
    onUpdateSettings({ [key]: parseFloat(value) });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={20} color="var(--color-cyan)" />
          Typiverse Settings
        </h2>

        <div className="settings-grid">
          {/* Age/Accessibility Mode */}
          <div className="setting-group">
            <label className="setting-label">Age & Accessibility</label>
            <select
              className="setting-select"
              value={settings.ageMode}
              onChange={(e) => onUpdateSettings({ ageMode: e.target.value })}
            >
              <option value="classic">Teen & Adult (Classic)</option>
              <option value="kids">Kids Mode (Friendly & Simple)</option>
              <option value="senior">Senior / High Contrast Accessibility</option>
            </select>
          </div>

          {/* Practice Material */}
          <div className="setting-group">
            <label className="setting-label">Category</label>
            <select
              className="setting-select"
              value={settings.category}
              onChange={(e) => onUpdateSettings({ category: e.target.value })}
              disabled={settings.ageMode === 'kids'} // Kids always gets simplified sets
            >
              <option value="words">Random Common Words</option>
              <option value="quotes">Famous Quotes & Sentences</option>
              <option value="code">Code Snippets (JavaScript/React)</option>
            </select>
          </div>

          {/* Test Duration */}
          <div className="setting-group">
            <label className="setting-label">Time Limit</label>
            <select
              className="setting-select"
              value={settings.duration}
              onChange={(e) => onUpdateSettings({ duration: parseInt(e.target.value) })}
            >
              <option value="15">15 Seconds</option>
              <option value="30">30 Seconds</option>
              <option value="60">60 Seconds</option>
            </select>
          </div>

          {/* Sound Mode */}
          <div className="setting-group">
            <label className="setting-label">Audio Clicks</label>
            <button
              type="button"
              className={`button ${settings.soundOn ? 'button-cyan' : ''}`}
              style={{ justifyContent: 'center', width: '100%', padding: '0.65rem' }}
              onClick={() => onUpdateSettings({ soundOn: !settings.soundOn })}
            >
              {settings.soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
              {settings.soundOn ? 'Sounds: On' : 'Sounds: Muted'}
            </button>
          </div>
        </div>

        {/* Voice Synth Settings */}
        <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
          <Eye size={16} color="var(--color-primary)" />
          Voice Assistance (Text-To-Speech)
        </h3>

        <div className="settings-grid">
          {/* TTS Enable Letter */}
          <div className="setting-group">
            <label className="setting-label">Speak Typed Letters</label>
            <select
              className="setting-select"
              value={settings.speakLetters ? 'yes' : 'no'}
              onChange={(e) => onUpdateSettings({ speakLetters: e.target.value === 'yes' })}
            >
              <option value="no">Disabled</option>
              <option value="yes">Enabled (Speak each key)</option>
            </select>
          </div>

          {/* TTS Enable Word */}
          <div className="setting-group">
            <label className="setting-label">Speak Target Words</label>
            <select
              className="setting-select"
              value={settings.speakWords ? 'yes' : 'no'}
              onChange={(e) => onUpdateSettings({ speakWords: e.target.value === 'yes' })}
            >
              <option value="no">Disabled</option>
              <option value="yes">Enabled (Pronounce word)</option>
            </select>
          </div>

          {/* TTS Voice Select */}
          <div className="setting-group" style={{ gridColumn: 'span 2' }}>
            <label className="setting-label">Voice Accent</label>
            <select
              className="setting-select"
              value={settings.voiceName}
              onChange={handleVoiceChange}
            >
              <option value="">Browser Default Voice</option>
              {voices.map(voice => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          </div>

          {/* Voice Pitch */}
          <div className="setting-group">
            <label className="setting-label">Voice Pitch ({settings.voicePitch})</label>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={settings.voicePitch}
              onChange={(e) => handleSliderChange('pitch', e.target.value)}
              className="setting-input"
              style={{ padding: 0 }}
            />
          </div>

          {/* Voice Rate */}
          <div className="setting-group">
            <label className="setting-label">Voice Speed ({settings.voiceRate})</label>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={settings.voiceRate}
              onChange={(e) => handleSliderChange('rate', e.target.value)}
              className="setting-input"
              style={{ padding: 0 }}
            />
          </div>
        </div>

        <button className="button button-cyan" style={{ width: '100%', justifyContent: 'center' }} onClick={onClose}>
          Save & Apply Settings
        </button>
      </div>
    </div>
  );
}
