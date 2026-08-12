import React from 'react';
import { HelpCircle, Compass, Keyboard, Volume2, Trophy, Sparkles, CheckCircle2, Zap } from 'lucide-react';

export default function HowToUseModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 102 }}>
      <div 
        className="modal-content glass-panel" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '680px', maxHeight: '85vh', overflowY: 'auto', padding: '2rem' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--color-cyan), var(--color-primary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px var(--color-cyan-glow)'
            }}>
              <HelpCircle color="#000" size={24} />
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.4rem', color: 'var(--color-text-primary)' }}>
                How to Use Typiverse 3D
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.1rem' }}>
                Master 3D typing, spaceship tunnel navigation, and voice synth assistance
              </p>
            </div>
          </div>
          <button 
            className="icon-btn" 
            onClick={onClose} 
            style={{ fontSize: '1.2rem', fontWeight: 700 }}
          >
            ✕
          </button>
        </div>

        {/* Feature Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          
          {/* Guide 1 */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-cyan)', fontWeight: 700 }}>
              <Zap size={18} />
              <span>1. How to Start Typing</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
              Click anywhere on the screen or start typing any letter. The timer will automatically begin. Type highlighted words accurately to build up your speed and streak multiplier!
            </p>
          </div>

          {/* Guide 2 */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontWeight: 700 }}>
              <Compass size={18} />
              <span>2. 3D Space vs Retro Typewriter</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
              Use the top selector buttons to switch between <strong>Space Arcade</strong> (WebGL space tunnel with laser particle effects) and <strong>Retro Typewriter</strong> (mechanical 3D keypresses).
            </p>
          </div>

          {/* Guide 3 */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-yellow)', fontWeight: 700 }}>
              <Sparkles size={18} />
              <span>3. Age Modes & Categories</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
              Open <strong>Settings</strong> to customize age modes: <strong>Classic</strong> (Quotes, Code, Words), <strong>Kids Mode</strong> (Short sentences, cheerful feedback), or <strong>Senior Mode</strong> (Large text, high clarity).
            </p>
          </div>

          {/* Guide 4 */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-pink)', fontWeight: 700 }}>
              <Volume2 size={18} />
              <span>4. Voice Assist & Audio Synth</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
              Enable <strong>Speak Letters</strong> or <strong>Speak Words</strong> in Settings to hear instant Text-To-Speech pronunciations. Mechanical clicks and spacebar laser sounds provide tactile audio cues.
            </p>
          </div>

        </div>

        {/* Keyboard Tips Box */}
        <div style={{
          background: 'rgba(34, 211, 238, 0.08)',
          border: '1px dashed var(--color-cyan)',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '1.5rem'
        }}>
          <h4 style={{ color: 'var(--color-cyan)', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Keyboard size={16} />
            Quick Keyboard Shortcuts & Controls
          </h4>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--color-text-secondary)', paddingLeft: '1.2rem' }}>
            <li><strong>Spacebar:</strong> Submit current word & fire space arcade laser</li>
            <li><strong>Backspace:</strong> Delete mis-typed letters to fix accuracy</li>
            <li><strong>Restart Test Button:</strong> Reset test timer, word queue, and metrics</li>
          </ul>
        </div>

        {/* Close Action */}
        <button 
          className="button button-cyan" 
          style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', fontSize: '0.95rem' }} 
          onClick={onClose}
        >
          <CheckCircle2 size={18} />
          Got It! Let's Type
        </button>
      </div>
    </div>
  );
}
