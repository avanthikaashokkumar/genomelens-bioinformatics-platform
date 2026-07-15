import { useId, useState } from 'react';
import { BookOpen, ChevronDown, ExternalLink } from 'lucide-react';
import { MODULES, SOURCE_GROUPS } from '../data/learning';

function LessonCard({ lessonTitle, card, index }) {
  const [expanded, setExpanded] = useState(false);
  const id = `${useId().replaceAll(':', '')}-${index}`;
  const toggle = () => setExpanded((current) => !current);

  function handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggle();
    }
  }

  return (
    <section className={`lesson-card${expanded ? ' expanded' : ''}`}>
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={id}
        onClick={toggle}
        onKeyDown={handleKeyDown}
      >
        <span>
          <b>{card.title}</b>
          <span className="expand-cue">{expanded ? 'Collapse' : 'Expand'}</span>
        </span>
        {card.code ? <code>{card.preview}</code> : <span className="lesson-preview">{card.preview}</span>}
      </button>
      {expanded && (
        <div id={id} className="lesson-full" aria-label={`${lessonTitle}: ${card.title} full explanation`}>
          {card.code ? <pre>{card.content}</pre> : <p>{card.content}</p>}
        </div>
      )}
    </section>
  );
}

export default function Learn() {
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLowerCase();
  const shown = MODULES.filter((module) =>
    JSON.stringify(module).toLowerCase().includes(normalizedQuery),
  );

  return (
    <div className="container content-page">
      <header className="page-hero">
        <div className="eyebrow"><span />Learning hub</div>
        <h1>Build intuition,<br /><em>one concept at a time.</em></h1>
        <p>Concise explanations connected directly to the tools you can use in the DNA Lab.</p>
        <label className="search">
          <BookOpen size={18} aria-hidden="true" />
          <span className="sr-only">Search learning concepts</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search concepts…"
          />
        </label>
      </header>

      <div className="learning-list">
        {shown.map((module, moduleIndex) => (
          <details key={module.title} open={moduleIndex === 0 && !normalizedQuery}>
            <summary>
              <span>{String(MODULES.indexOf(module) + 1).padStart(2, '0')}</span>
              <h2>{module.title}</h2>
              <ChevronDown aria-hidden="true" />
            </summary>
            <div className="lesson">
              {module.cards.map((lessonCard, index) => (
                <LessonCard
                  key={lessonCard.title}
                  lessonTitle={module.title}
                  card={lessonCard}
                  index={index}
                />
              ))}
            </div>
            <nav className="lesson-reading" aria-label={`Further reading for ${module.title}`}>
              <span>Read more:</span>
              {module.sources.map((sourceId) => {
                const source = SOURCE_GROUPS.flatMap((group) => group.sources)
                  .find((item) => item.id === sourceId);
                return <a key={sourceId} href={`#${sourceId}`}>{source.title}</a>;
              })}
            </nav>
          </details>
        ))}
        {shown.length === 0 && (
          <div className="empty" role="status">
            <h2>No lessons found</h2>
            <p>Try a broader search term such as DNA, ORF, motif, or translation.</p>
          </div>
        )}
      </div>

      <section className="glossary">
        <span className="kicker">Quick reference</span>
        <h2>Glossary</h2>
        <div>
          {[
            ['Base pair', 'Two complementary nucleotides joined across DNA strands.'],
            ['Codon', 'Three nucleotides interpreted as one amino-acid instruction or stop signal.'],
            ['5′ and 3′', 'Directional labels for nucleic-acid strands.'],
            ['Genome', 'An organism’s complete genetic material.'],
            ['In silico', 'Performed computationally rather than in a wet lab.'],
            ['ORF', 'Open reading frame; a candidate protein-coding stretch, not proof of a gene.'],
          ].map(([term, definition]) => (
            <article key={term}><b>{term}</b><p>{definition}</p></article>
          ))}
        </div>
      </section>

      <section id="sources" className="sources-section">
        <span className="kicker">Verify and explore</span>
        <h2>Sources &amp; Further Reading</h2>
        <p className="sources-intro">
          GenomeLens learning content is based on established genomics and bioinformatics references.
          These sources are provided so learners can verify definitions and explore each topic in greater depth.
        </p>
        {SOURCE_GROUPS.map((group) => (
          <section className="source-group" key={group.title}>
            <h3>{group.title}</h3>
            <div className="source-grid">
              {group.sources.map((source) => (
                <article id={source.id} key={source.id}>
                  <span>{source.institution}</span>
                  <h4>
                    <a href={source.url} target="_blank" rel="noopener noreferrer">
                      {source.title}<ExternalLink size={14} aria-hidden="true" />
                    </a>
                  </h4>
                  <p>{source.description}</p>
                </article>
              ))}
            </div>
          </section>
        ))}
      </section>
    </div>
  );
}
