import { Dna } from 'lucide-react';

const externalLinkProps = {
  target: '_blank',
  rel: 'noopener noreferrer',
};

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content container">
        <div className="footer-brand">
          <div className="brand">
            <Dna size={18} aria-hidden="true" />
            <span>GenomeLens</span>
          </div>
          <p>Educational sequence analysis. Not for medical diagnosis.</p>
        </div>

        <div className="footer-attribution">
          <p>
            Built by{' '}
            <a
              href="https://www.linkedin.com/in/avanthika-ashokkumar-819445342"
              {...externalLinkProps}
            >
              Avanthika Ashokkumar
            </a>
          </p>
          <p>Rutgers University–New Brunswick</p>
          <p>Biotechnology, Bioinformatics, and Data Science</p>
        </div>

        <nav className="footer-links" aria-label="Creator and project links">
          <a
            href="https://www.linkedin.com/in/avanthika-ashokkumar-819445342"
            {...externalLinkProps}
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/avanthikaashokkumar/genomelens-bioinformatics-platform"
            {...externalLinkProps}
          >
            GitHub
          </a>
          <a
            href="https://genomelens-bioinformatics-platform.vercel.app"
            {...externalLinkProps}
          >
            Live Project
          </a>
        </nav>
      </div>
    </footer>
  );
}
