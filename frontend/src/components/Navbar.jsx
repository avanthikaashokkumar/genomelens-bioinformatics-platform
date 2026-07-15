import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Dna, Menu, X } from 'lucide-react';

const LINKS = [
  ['/', 'Home'],
  ['/lab', 'DNA Lab'],
  ['/learn', 'Learn'],
  ['/docs', 'Docs'],
  ['/about', 'About'],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function closeOnEscape(event) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, []);

  return (
    <header className="navbar">
      <NavLink className="brand" to="/" onClick={() => setOpen(false)}>
        <span className="brand-mark"><Dna size={21} aria-hidden="true" /></span>
        <span>GenomeLens</span>
      </NavLink>
      <button
        type="button"
        className="menu"
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        aria-expanded={open}
        aria-controls="primary-navigation"
        onClick={() => setOpen((current) => !current)}
      >
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
      <nav
        id="primary-navigation"
        className={open ? 'open' : ''}
        aria-label="Primary navigation"
      >
        {LINKS.map(([to, label]) => (
          <NavLink key={to} to={to} onClick={() => setOpen(false)}>{label}</NavLink>
        ))}
      </nav>
    </header>
  );
}
