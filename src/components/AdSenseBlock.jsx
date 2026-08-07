import React, { useEffect, useState, useRef } from 'react';
import { AlertCircle, HelpCircle } from 'lucide-react';

export default function AdSenseBlock() {
  const [adState, setAdState] = useState('loading'); // loading | loaded | pending
  const insRef = useRef(null);

  useEffect(() => {
    // Try pushing the ad
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.warn("AdSense push warning: ", e);
      setAdState('pending'); // Fallback if adblocker or script block
    }

    // Check after 3.5 seconds if Google AdSense has modified the DOM (which it does when loading an ad)
    const checkTimer = setTimeout(() => {
      if (insRef.current) {
        // If Google AdSense loads, it adds data-ad-status="filled" or inserts an iframe/elements
        const isFilled = insRef.current.innerHTML.trim().length > 0 || 
                         insRef.current.getAttribute('data-ad-status') === 'filled';
        
        if (isFilled) {
          setAdState('loaded');
        } else {
          setAdState('pending');
        }
      }
    }, 3500);

    return () => clearTimeout(checkTimer);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '900px', margin: '1rem auto 0 auto', zIndex: 2 }}>
      {/* The actual Google AdSense Ins container */}
      <div style={{ display: adState === 'loaded' ? 'block' : 'none', width: '100%' }}>
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minHeight: '90px' }}
          data-ad-client="ca-pub-1560865754891276"
          data-ad-slot="8878909876"
          data-ad-format="horizontal"
          data-full-width-responsive="true"
        />
      </div>

      {/* Loading state placeholder */}
      {adState === 'loading' && (
        <div className="glass-panel" style={{ width: '100%', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: 'var(--color-text-secondary)', border: '1px dashed var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="spinner" style={{ border: '2px solid rgba(255,255,255,0.1)', borderTop: '2px solid var(--color-cyan)', borderRadius: '50%', width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} />
            Checking Google AdSense Connection...
          </div>
        </div>
      )}

      {/* Pending / Approval Not Found State Fallback Card */}
      {adState === 'pending' && (
        <div className="glass-panel" style={{ width: '100%', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', border: '1px solid rgba(251, 191, 36, 0.35)', background: 'rgba(251, 191, 36, 0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '2.2rem', height: '2.2rem', borderRadius: '50%', backgroundColor: 'rgba(251, 191, 36, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <AlertCircle size={18} color="var(--color-yellow)" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                Google AdSense: Account Getting Ready
                <span style={{ fontSize: '0.65rem', backgroundColor: 'var(--color-yellow)', color: '#000', padding: '0.15rem 0.35rem', borderRadius: '4px', fontWeight: 800 }}>PENDING</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.15rem' }}>
                Ad slot configured for <strong>ca-pub-1560865754891276</strong>. Live ads will automatically display here once Google completes verification of <code>typing-test-online-eta.vercel.app</code>.
              </div>
            </div>
          </div>
          <button 
            className="button button-cyan" 
            style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem', whiteSpace: 'nowrap' }}
            onClick={() => alert("Google AdSense is currently checking your site. Make sure your ads.txt is accessible at typing-test-online-eta.vercel.app/ads.txt. Review usually takes 2-14 days.")}
          >
            <HelpCircle size={12} />
            Why is this pending?
          </button>
        </div>
      )}

      {/* Add spin animation keyframes inline if not present */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
