import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import Results from '../components/Results';

const result = {
  sequence: 'ATGAAATAA',
  metadata: { minimum_orf_length: 2, orf_results_truncated: false },
  statistics: {
    length: 9,
    counts: { A: 6, T: 2, G: 1, C: 0, N: 0 },
    percentages: { A: 66.667, T: 22.222, G: 11.111, C: 0, N: 0 },
    gc_content: 11.111,
    at_content: 88.889,
    molecular_weight_da: 2834.85,
    melting_temperature_c: 22,
    divisible_by_three: true,
  },
  transformations: { complement: '', reverse_complement: '', rna_transcript: '', primary_translation: '' },
  reading_frames: [],
  orfs: [],
  motif: null,
  restriction_sites: [],
  codon_usage: { total_codons: 3, ignored_trailing_bases: 0, codons: [] },
  complexity: { shannon_entropy: 1.2, entropy_maximum_bits: 2, unique_nucleotide_count: 3, longest_homopolymer: { base: 'A', length: 3 } },
  interpretation: ['Educational result.'],
};

it('implements roving result tabs with linked panels and arrow navigation', () => {
  render(<Results data={result} />);
  const readingFrames = screen.getByRole('tab', { name: 'Reading Frames' });
  fireEvent.click(readingFrames);
  expect(readingFrames).toHaveAttribute('tabindex', '0');
  expect(screen.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', readingFrames.id);
  fireEvent.keyDown(readingFrames, { key: 'ArrowRight' });
  expect(screen.getByRole('tab', { name: 'ORFs' })).toHaveAttribute('aria-selected', 'true');
  expect(screen.getByRole('tab', { name: 'ORFs' })).toHaveFocus();
});

it('exposes mobile navigation state and closes it with Escape', () => {
  render(<MemoryRouter><App /></MemoryRouter>);
  const menu = screen.getByRole('button', { name: 'Open navigation' });
  expect(menu).toHaveAttribute('aria-controls', 'primary-navigation');
  fireEvent.click(menu);
  expect(screen.getByRole('button', { name: 'Close navigation' })).toHaveAttribute('aria-expanded', 'true');
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(screen.getByRole('button', { name: 'Open navigation' })).toHaveAttribute('aria-expanded', 'false');
});

it('provides a skip link and a useful Not Found route', () => {
  render(<MemoryRouter initialEntries={['/missing-page']}><App /></MemoryRouter>);
  expect(screen.getByRole('link', { name: 'Skip to main content' })).toHaveAttribute('href', '#main-content');
  expect(screen.getByRole('heading', { name: 'This sequence has no matching route.' })).toBeInTheDocument();
});
