import { Link } from 'react-router-dom';

const sections = [
  ['Accepted input', 'Paste raw DNA or exactly one FASTA record, or upload a .fasta, .fa, or .txt file up to 2 MB. The complete analysis accepts up to 100,000 cleaned nucleotides. Separate sequence-only API endpoints accept up to 1,000,000 cleaned nucleotides. Multi-record FASTA input is rejected rather than concatenated.'],
  ['Cleaning and validation', 'Whitespace and line breaks are removed and letters are uppercased. A single FASTA description line may have leading whitespace and is excluded from sequence data. A, T, G, C, and N are accepted; unsupported characters, header-only records, all-N inputs, misplaced headers, and multiple records are rejected.'],
  ['Coordinates', 'All displayed positions are one-based and inclusive on the submitted sequence. Reverse-strand ORFs and motif matches are mapped back to this coordinate system and labeled by strand. A palindromic motif at one physical interval is reported once with strand “both.”'],
  ['Translation and genetic code', 'GenomeLens uses NCBI standard genetic code 1 and ATG as its only ORF start codon. Ambiguous codons translate to X. Incomplete trailing codons are ignored. Other organisms, organelles, and tools may require a different genetic code or start-codon policy.'],
  ['Bounded ORF analysis', 'Each of three frames on each strand is scanned once. In each frame, the first ATG after a stop starts a candidate and the next in-frame TAA, TAG, or TGA closes it; nested starts are ignored. Boundary-reaching candidates are marked as lacking a stop. Scanning is linear in sequence length. Results are capped at 500 ORFs and 100,000 total returned protein amino acids, with an explicit truncation notice when either cap is reached.'],
  ['Molecular weight', 'For sequences containing only A, T, G, and C, GenomeLens uses Biopython to calculate the molecular weight of single-stranded, linear DNA with terminal groups included. The result is unavailable when N is present because guessing an average base would imply unsupported precision.'],
  ['Melting temperature', 'Unambiguous sequences under 14 nucleotides use Biopython’s Wallace rule; longer unambiguous sequences use Biopython’s GC-based empirical method (valueset 7). Tm is unavailable when N is present rather than deleting ambiguous positions and joining non-adjacent bases. Salt, concentration, mismatches, and laboratory conditions can materially change real Tm.'],
  ['Base-composition entropy', 'Shannon entropy here summarizes the frequency distribution of sequence symbols. Its maximum is 2 bits for balanced A/T/G/C or about 2.322 bits when N is also present. This is base-composition entropy, not a complete measure of biological sequence complexity.'],
  ['Privacy', 'Sequence content is sent to the configured API and GenomeLens does not intentionally write it to an application database or file. Hosting, network, and observability providers may retain request metadata or logs under their own configuration and policies. Do not submit sensitive or identifiable genomic data to a deployment you do not control and trust.'],
  ['Scientific limitations', 'Results are descriptors and hypotheses. GenomeLens performs no similarity search, gene annotation, quality-score analysis, circular-DNA handling, alternative genetic codes, expression measurement, clinical interpretation, or laboratory validation. An ORF is only a candidate; a motif may occur by chance; restriction-site prediction does not guarantee cleavage; divisibility by three does not establish a coding frame; and sequence analysis alone cannot establish medical significance.'],
  ['Learning sources', 'The Learn page cites authoritative material from NHGRI, NCBI, EMBL-EBI, and Biopython. Each lesson links to the relevant source group so definitions and methods can be verified in context.'],
];

export default function Documentation() {
  return (
    <div className="container content-page docs">
      <header className="page-hero">
        <div className="eyebrow"><span />Methods &amp; documentation</div>
        <h1>Transparent by <em>design.</em></h1>
        <p>Every result should be understandable, reproducible, and interpreted within its limits.</p>
        <div className="actions">
          <a
            className="button primary"
            href={`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/docs`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open interactive API docs ↗
          </a>
          <Link className="button ghost" to="/learn#sources">Learning sources</Link>
        </div>
      </header>
      <div className="doc-layout">
        <aside aria-label="Documentation sections">
          {sections.map(([title], index) => <a key={title} href={`#method-${index}`}>{title}</a>)}
        </aside>
        <div>
          {sections.map(([title, content], index) => (
            <section id={`method-${index}`} key={title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h2>{title}</h2>
              <p>{content}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
