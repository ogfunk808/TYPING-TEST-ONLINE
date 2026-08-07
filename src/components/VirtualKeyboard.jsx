import React from 'react';

const ROWS = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m"]
];

export default function VirtualKeyboard({ nextChar = "", lastKeyPressed = "" }) {
  // Normalize next char for highlighting
  const normalizedNext = nextChar ? nextChar.toLowerCase() : "";
  const normalizedLast = lastKeyPressed ? lastKeyPressed.toLowerCase() : "";

  return (
    <div className="virtual-keyboard">
      {ROWS.map((row, rIdx) => (
        <div key={rIdx} className="keyboard-row">
          {row.map((char) => {
            const isNext = normalizedNext === char;
            const isLast = normalizedLast === char;
            
            // Set styles based on highlight status
            let keyStyle = {};
            let classes = "key";

            if (isNext) {
              classes += " active";
              keyStyle = {
                borderColor: 'var(--color-cyan)',
                boxShadow: '0 0 10px var(--color-cyan-glow)',
                color: 'var(--color-bg)',
                backgroundColor: 'var(--color-cyan)',
                fontWeight: 'bold',
                transform: 'scale(1.05)'
              };
            } else if (isLast) {
              keyStyle = {
                borderColor: 'var(--color-pink)',
                boxShadow: '0 0 10px var(--color-pink-glow)',
                backgroundColor: 'rgba(244, 63, 94, 0.2)',
                color: '#fff'
              };
            }

            return (
              <span key={char} className={classes} style={keyStyle}>
                {char.toUpperCase()}
              </span>
            );
          })}
        </div>
      ))}
      <div className="keyboard-row">
        <span 
          className="key" 
          style={{ 
            width: '180px', 
            ...(normalizedNext === " " ? {
              borderColor: 'var(--color-cyan)',
              backgroundColor: 'var(--color-cyan)',
              color: 'var(--color-bg)',
              boxShadow: '0 0 10px var(--color-cyan-glow)',
              transform: 'scale(1.03)',
              fontWeight: 'bold'
            } : normalizedLast === " " ? {
              borderColor: 'var(--color-pink)',
              backgroundColor: 'rgba(244, 63, 94, 0.2)',
              color: '#fff'
            } : {})
          }}
        >
          SPACE
        </span>
      </div>
    </div>
  );
}
