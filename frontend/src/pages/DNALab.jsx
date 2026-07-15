import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SequenceInput from '../components/SequenceInput';
import Results from '../components/Results';
import { analyzeSequence } from '../services/api';
import { EXAMPLES } from '../data/examples';

export default function DNALab() {
  const [params] = useSearchParams();
  const [sequence, setSequence] = useState('');
  const [motif, setMotif] = useState('');
  const [minOrf, setMinOrf] = useState(10);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const activeRequest = useRef(null);

  useEffect(() => {
    if (params.get('demo')) setSequence(EXAMPLES[2].sequence);
  }, [params]);

  useEffect(() => () => activeRequest.current?.abort(), []);

  async function analyze() {
    activeRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;
    setLoading(true);
    setError('');
    try {
      const result = await analyzeSequence({
        sequence,
        minimum_orf_length: Number(minOrf),
        motif: motif || null,
      }, { signal: controller.signal });
      if (activeRequest.current !== controller) return;
      setData(result);
      window.setTimeout(() => document.querySelector('.results')?.scrollIntoView?.({ behavior: 'smooth' }), 50);
    } catch (requestError) {
      if (requestError.name !== 'AbortError' && activeRequest.current === controller) {
        setError(requestError.message);
      }
    } finally {
      if (activeRequest.current === controller) {
        activeRequest.current = null;
        setLoading(false);
      }
    }
  }

  function reset() {
    activeRequest.current?.abort();
    activeRequest.current = null;
    setLoading(false);
    setData(null);
    setError('');
  }

  return (
    <div className="lab container">
      <SequenceInput
        {...{ sequence, setSequence, motif, setMotif, minOrf, setMinOrf, loading, error }}
        onAnalyze={analyze}
        onReset={reset}
      />
      {data && <Results data={data} />}
    </div>
  );
}
