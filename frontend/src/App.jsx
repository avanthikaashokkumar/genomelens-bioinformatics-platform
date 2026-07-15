import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import DNALab from './pages/DNALab';
import Learn from './pages/Learn';
import Documentation from './pages/Documentation';
import About from './pages/About';
import NotFound from './pages/NotFound';

function RouteEffects() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return undefined;
    const frame = window.requestAnimationFrame(() => {
      const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      target?.scrollIntoView?.({ block: 'start' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [location.pathname, location.hash]);

  return null;
}

export default function App() {
  return (
    <div className="app">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <RouteEffects />
      <Navbar />
      <main id="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lab" element={<DNALab />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/docs" element={<Documentation />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
