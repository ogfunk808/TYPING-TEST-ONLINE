import React, { useState, useEffect } from 'react';
import { Sparkles, Terminal, Rocket, Smile } from 'lucide-react';
import { playSound } from '../utils/audioSynth';

const ADS = [
  {
    icon: "⌨️",
    title: "TypeMaster 9000 Mechanical Keyboard",
    desc: "Get clacking with hot-swappable switches, sound dampening foam, and full RGB matrix customizer. 20% off today!",
    action: "Shop Mechanicals",
    linkName: "Mechanical Switches Sale",
    detail: "Experience mechanical typing bliss! Designed with premium aluminum frames, Gateron brown tactile switches, and high-quality double-shot PBT keycaps. Specially customized for hyper-fast space racers."
  },
  {
    icon: "🚀",
    title: "Antigravity AI Code Editor",
    desc: "Code at the speed of thought. Advanced autocompletion, real-time refactoring, and built-in Three.js canvas playgrounds.",
    action: "Install Zero-G",
    linkName: "Antigravity AI IDE",
    detail: "Break the laws of physics and code with Antigravity! Supports standard web programming languages, automatic voice debugging assistance, and interactive workspace visualization. Designed by the Deepmind team."
  },
  {
    icon: "💫",
    title: "KidsType Adventures Premium",
    desc: "Make typing fun! Beautiful game stages, friendly animal guides, and custom stories for kids aged 5 to 12.",
    action: "Start Free Trial",
    linkName: "KidsType Adventure Club",
    detail: "Kids learn to type 3x faster with KidsType Adventures! Fully interactive visual keymap guide, customizable avatar rewards, zero external advertisements, and friendly voice guidance support."
  },
  {
    icon: "⚡",
    title: "WarpDrive Edge Web Hosting",
    desc: "Deploy your Three.js and WebGL creations globally with sub-millisecond response times. Zero-config React integration.",
    action: "Deploy Free",
    linkName: "WarpDrive Cloud",
    detail: "Speed up your WebGL sites with WarpDrive CDN! Global edge network caching, integrated SSL, instant GitHub deployments, and unlimited bandwidth limits. Perfect for game launches."
  }
];

export default function AdSponsor({ soundOn = true }) {
  const [currentAdIdx, setCurrentAdIdx] = useState(0);
  const [showDetail, setShowDetail] = useState(false);

  // Rotate ads every 12 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAdIdx((prev) => (prev + 1) % ADS.length);
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  const activeAd = ADS[currentAdIdx];

  const handleAdClick = () => {
    if (soundOn) playSound.success();
    setShowDetail(true);
  };

  const getAdIcon = () => {
    switch (currentAdIdx) {
      case 0: return <Sparkles size={20} color="var(--color-yellow)" />;
      case 1: return <Terminal size={20} color="var(--color-cyan)" />;
      case 2: return <Smile size={20} color="var(--color-pink)" />;
      case 3: return <Rocket size={20} color="var(--color-green)" />;
      default: return null;
    }
  };

  return (
    <>
      <div className="ad-sponsor glass-panel" onClick={handleAdClick} style={{ cursor: 'pointer' }}>
        <span className="ad-badge">Sponsored Sponsor</span>
        <div className="ad-content">
          <div className="ad-icon-box">
            {activeAd.icon}
          </div>
          <div className="ad-text">
            <div className="ad-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {getAdIcon()}
              {activeAd.title}
            </div>
            <div className="ad-desc">{activeAd.desc}</div>
          </div>
        </div>
        <button className="ad-action" onClick={(e) => { e.stopPropagation(); handleAdClick(); }}>
          {activeAd.action}
        </button>
      </div>

      {/* Ad detail mockup pop-up */}
      {showDetail && (
        <div className="modal-overlay" onClick={() => setShowDetail(false)}>
          <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px', border: '1px solid var(--color-yellow)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 800, fontSize: '0.75rem', color: 'var(--color-yellow)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                ⭐ Exclusive Sponsor Deal
              </div>
              <span className="ad-icon-box" style={{ width: '2rem', height: '2rem', fontSize: '1rem', borderRadius: '6px' }}>
                {activeAd.icon}
              </span>
            </div>

            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem' }}>
              {activeAd.title}
            </h3>

            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
              {activeAd.detail}
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button 
                className="button button-cyan" 
                style={{ flex: 1, justifyContent: 'center' }} 
                onClick={() => {
                  if (soundOn) playSound.success();
                  alert(`Thank you for checking out "${activeAd.linkName}"! (This is a premium simulated advertisement dashboard sponsor for the typing test application).`);
                  setShowDetail(false);
                }}
              >
                Go to Sponsor
              </button>
              <button 
                className="button" 
                style={{ flex: 1, justifyContent: 'center' }} 
                onClick={() => setShowDetail(false)}
              >
                Close Ad
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
