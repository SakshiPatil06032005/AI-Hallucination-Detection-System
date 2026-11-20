import { AnimatePresence, motion } from 'framer-motion';
import { UserRound } from 'lucide-react';
import { useState } from 'react';

const links = [
  { label: 'Home', href: '/' },
  { label: 'Detect', href: '/detect' },
  { label: 'History', href: '/history' },
  { label: 'Analytics', href: '/analytics' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'About', href: '/about' },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => document.documentElement.dataset.theme === 'dark');

  const toggleTheme = () => {
    const nextDarkMode = !darkMode;
    setDarkMode(nextDarkMode);
    document.documentElement.dataset.theme = nextDarkMode ? 'dark' : 'light';
    try { const stored = JSON.parse(window.localStorage.getItem('hallucidetect-profile-preferences') ?? '{}'); window.localStorage.setItem('hallucidetect-profile-preferences', JSON.stringify({ ...stored, theme: nextDarkMode ? 'dark' : 'light' })); } catch { /* localStorage is optional in the demo */ }
  };

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Primary navigation">
        <a className="brand" href="/" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark" aria-hidden="true">H</span>
          <span>HalluciDetect</span>
        </a>

        <div className="desktop-nav-links">
          {links.map((link) => (
            <a key={link.label} href={link.href}>{link.label}</a>
          ))}
        </div>

        <div className="nav-actions">
          <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label="Toggle color theme" aria-pressed={darkMode}>
            <span className="theme-icon" aria-hidden="true">{darkMode ? '○' : '●'}</span>
            <span className="theme-label">{darkMode ? 'Dark' : 'Light'}</span>
          </button>
          <a className="nav-cta" href="/detect">Analyze</a>
          <a className="profile-nav-link" href="/profile" aria-label="Open profile" title="Profile"><UserRound size={17} /></a>
          <button
            className={`menu-toggle${menuOpen ? ' is-open' : ''}`}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setMenuOpen((isOpen) => !isOpen)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              id="mobile-navigation"
              className="mobile-nav-links"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              {links.map((link) => (
                <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</a>
              ))}
              <a className="mobile-nav-cta" href="/detect" onClick={() => setMenuOpen(false)}>Analyze AI Response</a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
