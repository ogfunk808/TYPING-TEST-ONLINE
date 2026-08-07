import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function PrivacyPolicy({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 101 }}>
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
          <ShieldCheck color="var(--color-green)" size={24} />
          Privacy Policy
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
          <p><strong>Effective Date: August 7, 2026</strong></p>
          
          <p>
            At Typiverse 3D, accessible from this website, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Typiverse 3D and how we use it.
          </p>

          <h3 style={{ color: 'var(--color-text-primary)', fontSize: '1.1rem', fontWeight: 700 }}>Google DoubleClick DART Cookie</h3>
          <p>
            Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL: <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-cyan)' }}>https://policies.google.com/technologies/ads</a>.
          </p>

          <h3 style={{ color: 'var(--color-text-primary)', fontSize: '1.1rem', fontWeight: 700 }}>Our Advertising Partners</h3>
          <p>
            We use Google AdSense to serve advertisements on our web application. Google AdSense uses cookies to serve ads based on users' visits to our site and other sites on the Internet.
          </p>

          <h3 style={{ color: 'var(--color-text-primary)', fontSize: '1.1rem', fontWeight: 700 }}>Information We Collect Locally</h3>
          <p>
            Typiverse 3D does not run a remote database to collect your personal information. All typing statistics, speeds, custom settings, and leaderboards are stored strictly on your local device's browser using <code>localStorage</code>. You can clear this data at any time by resetting your browser cache or using the "Reset Board" button inside the Leaderboard panel.
          </p>

          <h3 style={{ color: 'var(--color-text-primary)', fontSize: '1.1rem', fontWeight: 700 }}>Children's Information</h3>
          <p>
            Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity. Typiverse 3D does not knowingly collect any Personal Identifiable Information from children under the age of 13.
          </p>

          <h3 style={{ color: 'var(--color-text-primary)', fontSize: '1.1rem', fontWeight: 700 }}>Consent</h3>
          <p>
            By using our website, you hereby consent to our Privacy Policy and agree to its terms.
          </p>
        </div>

        <button className="button button-cyan" style={{ marginTop: '1.5rem', width: '100%', justifyContent: 'center' }} onClick={onClose}>
          Close Policy
        </button>
      </div>
    </div>
  );
}
