import {render,screen,fireEvent} from '@testing-library/react'; import {MemoryRouter} from 'react-router-dom'; import DNALab from '../pages/DNALab';
const result={sequence:'ATGAAATAA',metadata:{fasta_header_detected:false,minimum_orf_length:2},statistics:{length:9,counts:{A:6,T:2,G:1,C:0,N:0},percentages:{A:66.667,T:22.222,G:11.111,C:0,N:0},gc_content:11.111,at_content:88.889,molecular_weight_da:2700,melting_temperature_c:22,divisible_by_three:true},transformations:{complement:'TACTTTATT',reverse_complement:'TTATTTCAT',rna_transcript:'AUGAAAUAA',primary_translation:'MK*'},reading_frames:[],orfs:[],motif:null,restriction_sites:[],codon_usage:{total_codons:3,ignored_trailing_bases:0,codons:[]},complexity:{shannon_entropy:1.2,unique_nucleotide_count:3,longest_homopolymer:{base:'A',length:3}},interpretation:['Educational result.']};
beforeEach(()=>{global.fetch=vi.fn()});
it('loads example data and resets returned results',async()=>{render(<MemoryRouter><DNALab/></MemoryRouter>);fireEvent.change(screen.getByLabelText('Load example sequence'),{target:{value:'0'}});expect(screen.getByLabelText('DNA or FASTA sequence').value).toContain('ATG');fetch.mockResolvedValue({ok:true,json:async()=>result});fireEvent.click(screen.getByRole('button',{name:/run complete analysis/i}));expect(screen.getByText(/analyzing sequence/i)).toBeInTheDocument();await screen.findByText('Your sequence, decoded.');fireEvent.click(screen.getByRole('button',{name:/reset analysis/i}));expect(screen.queryByText('Your sequence, decoded.')).not.toBeInTheDocument()});
it('disables submit and displays invalid DNA status',()=>{render(<MemoryRouter><DNALab/></MemoryRouter>);fireEvent.change(screen.getByLabelText('DNA or FASTA sequence'),{target:{value:'ATGB'}});expect(screen.getByText('Invalid: B')).toBeInTheDocument();expect(screen.getByRole('button',{name:/run complete analysis/i})).toBeDisabled()});
it('accepts one FASTA record with whitespace before its header',()=>{render(<MemoryRouter><DNALab/></MemoryRouter>);fireEvent.change(screen.getByLabelText('DNA or FASTA sequence'),{target:{value:'   >sample\nATGC'}});expect(screen.getByText('Valid DNA alphabet and single-record format')).toBeInTheDocument();expect(screen.getByRole('button',{name:/run complete analysis/i})).toBeEnabled()});
it('rejects a header-only FASTA record',()=>{render(<MemoryRouter><DNALab/></MemoryRouter>);fireEvent.change(screen.getByLabelText('DNA or FASTA sequence'),{target:{value:'>sample'}});expect(screen.getByText('The input contains a FASTA header but no DNA sequence.')).toBeInTheDocument();expect(screen.getByRole('button',{name:/run complete analysis/i})).toBeDisabled()});
it('shows backend validation errors',async()=>{fetch.mockResolvedValue({ok:false,json:async()=>({detail:'Sequence is invalid.'})});render(<MemoryRouter><DNALab/></MemoryRouter>);fireEvent.change(screen.getByLabelText('DNA or FASTA sequence'),{target:{value:'ATGC'}});fireEvent.click(screen.getByRole('button',{name:/run complete analysis/i}));expect(await screen.findByRole('alert')).toHaveTextContent('Sequence is invalid.')});

it.each([
  ['multiple FASTA records', '>one\nATG\n>two\nTAA', '', '10'],
  ['an invalid motif', 'ATGC', 'ATN', '10'],
  ['an invalid ORF range', 'ATGC', '', '0'],
  ['oversized sequence input', 'A'.repeat(100001), '', '10'],
])('disables analysis for %s', (_, sequence, motif, minimumOrf) => {
  render(<MemoryRouter><DNALab /></MemoryRouter>);
  fireEvent.change(screen.getByLabelText('DNA or FASTA sequence'), { target: { value: sequence } });
  if (motif) fireEvent.change(screen.getByLabelText('Optional DNA motif'), { target: { value: motif } });
  if (minimumOrf !== '10') fireEvent.change(screen.getByLabelText(/Minimum ORF length/), { target: { value: minimumOrf } });
  expect(screen.getByRole('button', { name: /run complete analysis/i })).toBeDisabled();
});

it('cancels an active request when reset is selected', () => {
  fetch.mockImplementation((_, options) => new Promise((resolve, reject) => {
    options.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
  }));
  render(<MemoryRouter><DNALab /></MemoryRouter>);
  fireEvent.change(screen.getByLabelText('DNA or FASTA sequence'), { target: { value: 'ATGC' } });
  fireEvent.click(screen.getByRole('button', { name: /run complete analysis/i }));
  fireEvent.click(screen.getByRole('button', { name: /reset analysis/i }));
  expect(fetch.mock.calls[0][1].signal.aborted).toBe(true);
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});

it('cancels an active request when the lab unmounts', () => {
  fetch.mockImplementation((_, options) => new Promise((resolve, reject) => {
    options.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
  }));
  const view = render(<MemoryRouter><DNALab /></MemoryRouter>);
  fireEvent.change(screen.getByLabelText('DNA or FASTA sequence'), { target: { value: 'ATGC' } });
  fireEvent.click(screen.getByRole('button', { name: /run complete analysis/i }));
  view.unmount();
  expect(fetch.mock.calls[0][1].signal.aborted).toBe(true);
});
