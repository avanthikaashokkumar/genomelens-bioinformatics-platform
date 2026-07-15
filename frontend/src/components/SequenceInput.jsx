import { useRef } from 'react';
import { FileUp, Play, RotateCcw, Sparkles } from 'lucide-react';
import { EXAMPLES } from '../data/examples';

const MAX_ANALYSIS_BASES = 100_000;
const MAX_FILE_BYTES = 2 * 1024 * 1024;
const MAX_MOTIF_LENGTH = 1_000;
const MULTI_FASTA_ERROR = 'GenomeLens currently supports one FASTA record at a time. Please submit or upload a single sequence.';

function validateAnalysisInput(sequence, motif, minOrf) {
  const trimmed = sequence.trim();
  const lines = trimmed ? trimmed.split(/\r?\n/) : [];
  const headerIndexes = lines
    .map((line, index) => (line.trimStart().startsWith('>') ? index : -1))
    .filter((index) => index >= 0);
  const compact = lines
    .filter((line) => !line.trimStart().startsWith('>'))
    .join('')
    .replace(/\s/g, '')
    .toUpperCase();
  const invalidBases = [...new Set(compact.replace(/[ATGCN]/g, ''))].sort();
  const compactMotif = motif.replace(/\s/g, '').toUpperCase();
  const invalidMotif = [...new Set(compactMotif.replace(/[ATGC]/g, ''))].sort();
  const parsedOrf = Number(minOrf);

  let sequenceError = '';
  if (!trimmed) sequenceError = 'Enter a DNA sequence before running an analysis.';
  else if (headerIndexes.length > 1) sequenceError = MULTI_FASTA_ERROR;
  else if (headerIndexes.length === 1 && headerIndexes[0] !== 0) sequenceError = 'A FASTA description line must appear before the sequence data.';
  else if (!compact) sequenceError = 'The input contains a FASTA header but no DNA sequence.';
  else if (invalidBases.length) sequenceError = `Invalid: ${invalidBases.join(', ')}`;
  else if (compact.length > MAX_ANALYSIS_BASES) sequenceError = `Complete analysis accepts up to ${MAX_ANALYSIS_BASES.toLocaleString()} nucleotides.`;
  else if (/^N+$/.test(compact)) sequenceError = 'A sequence containing only N bases cannot produce a meaningful analysis.';

  let motifError = '';
  if (invalidMotif.length) motifError = `Motif contains invalid character(s): ${invalidMotif.join(', ')}.`;
  else if (compactMotif.length > MAX_MOTIF_LENGTH) motifError = `Motif exceeds the ${MAX_MOTIF_LENGTH.toLocaleString()}-nucleotide limit.`;

  const orfError = Number.isInteger(parsedOrf) && parsedOrf >= 1 && parsedOrf <= 10_000
    ? ''
    : 'Minimum ORF length must be a whole number from 1 to 10,000.';

  return { compact, sequenceError, motifError, orfError };
}

export default function SequenceInput({
  sequence,
  setSequence,
  motif,
  setMotif,
  minOrf,
  setMinOrf,
  onAnalyze,
  onReset,
  loading,
  error,
}) {
  const fileInput = useRef();
  const validation = validateAnalysisInput(sequence, motif, minOrf);
  const localError = validation.sequenceError || validation.motifError || validation.orfError;

  async function upload(event) {
    const file = event.target.files[0];
    if (!file) return;
    event.target.setCustomValidity('');
    if (!/\.(fasta|fa|txt)$/i.test(file.name)) {
      event.target.setCustomValidity('Choose a .fasta, .fa, or .txt file.');
      event.target.reportValidity();
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      event.target.setCustomValidity('File exceeds the 2 MB upload limit.');
      event.target.reportValidity();
      return;
    }
    setSequence(await file.text());
  }

  return (
    <section className="input-panel">
      <div className="panel-title">
        <div><span className="kicker">Input workspace</span><h1>DNA Sequence Lab</h1></div>
        <span className="privacy-pill">Processed in memory</span>
      </div>

      <label htmlFor="sequence">DNA or FASTA sequence</label>
      <textarea
        id="sequence"
        value={sequence}
        onChange={(event) => setSequence(event.target.value)}
        placeholder={'>optional_header\nATGCGTACG...'}
        spellCheck="false"
        aria-invalid={Boolean(validation.sequenceError && sequence.trim())}
        aria-describedby="sequence-hint input-validation"
      />
      <div className="input-meta" id="sequence-hint">
        <span>{sequence.length.toLocaleString()} characters · {validation.compact.length.toLocaleString()} cleaned nucleotides</span>
        <span className={validation.sequenceError ? 'invalid' : 'valid'}>
          {validation.sequenceError || 'Valid DNA alphabet and single-record format'}
        </span>
      </div>

      <div className="input-actions">
        <input ref={fileInput} type="file" accept=".fasta,.fa,.txt" onChange={upload} hidden />
        <button type="button" className="button ghost small" onClick={() => fileInput.current.click()}>
          <FileUp size={16} aria-hidden="true" /> Upload file
        </button>
        <select
          aria-label="Load example sequence"
          defaultValue=""
          onChange={(event) => {
            const example = EXAMPLES[Number(event.target.value)];
            if (example) setSequence(example.sequence);
          }}
        >
          <option value="" disabled>Load an example…</option>
          {EXAMPLES.map((example, index) => <option key={example.name} value={index}>{example.name}</option>)}
        </select>
        <button type="button" className="text-button" onClick={() => setSequence('')}>
          <RotateCcw size={15} aria-hidden="true" /> Clear input
        </button>
      </div>

      <div className="options">
        <label htmlFor="minimum-orf-length">
          Minimum ORF length
          <span>
            <input
              id="minimum-orf-length"
              type="number"
              min="1"
              max="10000"
              step="1"
              value={minOrf}
              aria-invalid={Boolean(validation.orfError)}
              onChange={(event) => setMinOrf(event.target.value)}
            /> amino acids
          </span>
        </label>
        <label htmlFor="motif">
          Optional DNA motif
          <input
            id="motif"
            value={motif}
            aria-invalid={Boolean(validation.motifError)}
            onChange={(event) => setMotif(event.target.value)}
            placeholder="e.g. GAATTC"
          />
        </label>
      </div>
      <p className="limit-note">Accepts A, T, G, C, and N · One FASTA record · Complete analysis up to 100,000 nucleotides · Files up to 2 MB</p>
      <div id="input-validation" className="validation-message" aria-live="polite">
        {validation.motifError || validation.orfError}
      </div>
      {error && <div className="error" role="alert">{error}</div>}

      <div className="run-row">
        <button
          type="button"
          className="button primary run"
          disabled={loading || Boolean(localError)}
          onClick={onAnalyze}
        >
          {loading
            ? <><span className="spinner" />Analyzing sequence…</>
            : <><Play size={18} aria-hidden="true" />Run complete analysis</>}
        </button>
        <button type="button" className="button ghost" onClick={onReset}>Reset analysis</button>
      </div>

      <div className="science-note">
        <Sparkles size={18} aria-hidden="true" />
        <span><b>What happens next?</b> We validate and clean one sequence, then calculate composition, six reading frames, bounded candidate ORFs, motifs, restriction sites, codon usage, and base-composition entropy.</span>
      </div>
    </section>
  );
}
