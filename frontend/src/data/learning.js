const card = (title, preview, content, code = false) => ({ title, preview, content, code });

export const MODULES = [
  {
    title: 'What is DNA?',
    cards: [
      card('Definition', 'DNA stores biological information in a sequence of bases.', 'Deoxyribonucleic acid (DNA) is a polymer whose nucleotide sequence uses the bases A, T, G, and C. Most cellular DNA is double-stranded, with complementary strands running in opposite directions.'),
      card('Why It Matters', 'DNA sequence is one layer of biological information.', 'Sequence order can contribute to protein-coding, regulatory, structural, and other roles, but a DNA segment cannot be assigned a role from its letters alone.'),
      card('Small Example', 'ATGC pairs with TACG.', 'In a simplified pairing example, 5′-ATGC-3′ pairs with 3′-TACG-5′ because A pairs with T and G pairs with C.', true),
      card('Common Mistake', 'A DNA segment is not automatically a gene.', 'Avoid calling every DNA segment a gene. Establishing gene identity or function requires biological context, reference evidence, and often experiments.'),
      card('In the DNA Lab', 'Begin with composition, not identity claims.', 'Use Overview and Composition to describe the submitted sequence. GenomeLens does not determine gene identity, organism, function, or medical significance.'),
    ],
    sources: ['source-nhgri-glossary', 'source-nhgri-dna'],
  },
  {
    title: 'What is a FASTA file?',
    cards: [
      card('Definition', 'A FASTA record starts with a > description line.', 'A FASTA record contains a description line beginning with >, followed by one or more lines of sequence data.'),
      card('Why It Matters', 'FASTA is a portable sequence format.', 'FASTA makes nucleotide and protein sequences portable between databases and bioinformatics tools.'),
      card('Small Example', '>sample\nATGC', '>sample\nATGC', true),
      card('Common Mistake', 'The description is not biological sequence.', 'Including the description line as part of the biological sequence.'),
      card('In the DNA Lab', 'Paste one record or upload a supported text file.', 'Paste a complete FASTA record or upload a .fasta, .fa, or .txt file.'),
    ],
    sources: ['source-ncbi-methods'],
  },
  {
    title: 'What is GC content?',
    cards: [
      card('Definition', 'GC content is the share of known bases that are G or C.', 'GenomeLens calculates GC content as G plus C divided by the number of known A, T, G, and C bases. N bases are reported separately and excluded from this percentage.'),
      card('Why It Matters', 'GC content is a broad composition descriptor.', 'GC content can help compare sequences and may relate to duplex stability under specified conditions, but it is only one summary statistic.'),
      card('Small Example', 'GCGT is 75% GC.', 'The sequence GCGT contains three G/C bases among four known bases, so its GC content is 75%.', true),
      card('Common Mistake', 'GC content cannot identify a gene or organism.', 'GC content alone cannot establish gene identity, organism, function, expression, or medical significance. Unrelated sequences can have similar GC percentages.'),
      card('In the DNA Lab', 'Compare counts, percentages, and ambiguity together.', 'Use Composition with the N percentage and sequence length. Treat GC content as descriptive evidence, not an identification result.'),
    ],
    sources: ['source-biopython', 'source-ncbi-methods'],
  },
  {
    title: 'Complement versus reverse complement',
    cards: [
      card('Definition', 'Complementing swaps partners; reverse-complementing also reverses order.', 'A complement replaces each base with its pairing partner. A reverse complement then reverses that complement so the opposite strand is represented in the conventional 5′→3′ direction.'),
      card('Why It Matters', 'Strand-aware analysis needs consistent direction.', 'DNA strands are antiparallel. Searching or translating the opposite strand therefore requires the reverse complement, not only the complement.'),
      card('Small Example', 'ATGC → TACG; reverse complement → GCAT.', 'For 5′-ATGC-3′, the complement is 3′-TACG-5′ and the reverse-complement sequence written 5′→3′ is 5′-GCAT-3′.', true),
      card('Common Mistake', 'Complement and reverse complement are not interchangeable.', 'Using a complement where a 5′→3′ reverse complement is required can produce incorrect motif, coordinate, and translation interpretations.'),
      card('In the DNA Lab', 'Compare both transformations and six frames.', 'Transformations displays both forms. Reading Frames analyzes three offsets on the submitted strand and three on its reverse complement.'),
    ],
    sources: ['source-nhgri-dna', 'source-ncbi-methods'],
  },
  {
    title: 'Transcription',
    cards: [
      card('Definition', 'Transcription produces an RNA copy from a DNA template.', 'In cells, RNA polymerase uses one DNA strand as a template to synthesize RNA. GenomeLens shows a simplified sequence transformation by replacing T with U.'),
      card('Why It Matters', 'Transcription connects DNA to many RNA functions.', 'RNA molecules can serve as protein-coding intermediates or perform regulatory, structural, and catalytic roles.'),
      card('Small Example', 'ATGC → AUGC in the simplified display.', 'GenomeLens transforms ATGC to AUGC by substituting U for T. This does not model promoters, strand selection, splicing, or expression.', true),
      card('Common Mistake', 'A computed transcript is not evidence of expression.', 'Sequence transformation alone does not show that a region is transcribed in a cell, tissue, condition, or organism.'),
      card('In the DNA Lab', 'Treat the RNA output as a deterministic transformation.', 'Inspect RNA transcript under Transformations. It represents the submitted sequence with U substituted for T, not an experimentally measured transcript.'),
    ],
    sources: ['source-nhgri-transcription'],
  },
  {
    title: 'Translation',
    cards: [
      card('Definition', 'Translation maps codons to amino-acid symbols.', 'Biological translation is performed by ribosomes using RNA. GenomeLens computationally maps complete nucleotide triplets to amino acids with NCBI standard genetic code 1.'),
      card('Why It Matters', 'Translation generates protein-sequence hypotheses.', 'A translation can help inspect a candidate coding region, but a translated string does not prove that a protein is expressed, stable, or functional.'),
      card('Small Example', 'ATG maps to M under the standard code.', 'Under NCBI genetic code 1, ATG maps to methionine (M). Other genetic codes and biological start rules can differ.', true),
      card('Common Mistake', 'Frame, strand, code, and incomplete codons matter.', 'Do not assume frame 1 is biological. GenomeLens ignores incomplete trailing codons and represents codons containing N as X.'),
      card('In the DNA Lab', 'Compare six computational translations.', 'Use Reading Frames to compare three offsets on each strand. Confirm promising translations with reference databases and experimental context.'),
    ],
    sources: ['source-nhgri-translation', 'source-nhgri-codon'],
  },
  {
    title: 'Codons and reading frames',
    cards: [
      card('Definition', 'A reading frame groups a strand into consecutive triplets.', 'A linear nucleotide strand has three possible triplet offsets. Considering the reverse-complement strand produces six computational reading frames.'),
      card('Why It Matters', 'Changing the offset changes every downstream codon.', 'Different frames can yield different amino-acid strings and stop positions. Biological frame selection depends on context that GenomeLens does not infer.'),
      card('Small Example', 'AATG… starts AAT in frame 1 and ATG in frame 2.', 'For AATG…, frame 1 begins AAT while frame 2 begins ATG. The same letters therefore produce different codon groupings.', true),
      card('Common Mistake', 'Divisibility by three does not establish a coding frame.', 'A sequence length divisible by three only means frame 1 has no trailing bases. It does not prove that frame 1 is expressed or biologically meaningful.'),
      card('In the DNA Lab', 'Inspect all frames without treating one as confirmed.', 'Reading Frames reports translations under the standard genetic code. Use the results as candidates for further comparison, not gene calls.'),
    ],
    sources: ['source-nhgri-codon', 'source-nhgri-translation'],
  },
  {
    title: 'Open reading frames',
    cards: [
      card('Definition', 'GenomeLens reports ATG-started candidate coding regions.', 'GenomeLens defines a candidate ORF as an ATG-started segment that reaches the next in-frame TAA, TAG, or TGA, or the sequence boundary. Definitions and start-codon choices vary among tools.'),
      card('Why It Matters', 'ORFs help prioritize possible protein-coding segments.', 'Long stop-free stretches can support a coding hypothesis, but ORF length and translation alone do not establish a gene, expression, or function.'),
      card('Small Example', 'ATG GCT TAA → MA and a stop.', 'Under the standard genetic code, ATG GCT TAA translates to methionine, alanine, and a stop signal. GenomeLens displays the protein as MA.', true),
      card('Common Mistake', 'Every ORF is not a real gene.', 'ORFs can occur by chance. Biological interpretation needs genomic context, conservation or database evidence, and often experimental confirmation.'),
      card('In the DNA Lab', 'Results are bounded and nested starts are ignored.', 'The linear scanner reports the first ATG-started candidate before each in-frame stop, ignores nested starts, and applies documented ORF and protein-output caps.'),
    ],
    sources: ['source-nhgri-orf', 'source-ncbi-orffinder'],
  },
  {
    title: 'Restriction enzymes',
    cards: [
      card('Definition', 'Restriction enzymes recognize particular DNA patterns.', 'Many restriction endonucleases recognize short sequence motifs and cleave DNA at or near characteristic positions under suitable laboratory conditions.'),
      card('Why It Matters', 'Predicted sites can support experimental planning.', 'Restriction maps can help compare constructs or plan cloning, but sequence recognition is only part of a real digest workflow.'),
      card('Small Example', 'EcoRI recognizes GAATTC.', 'GenomeLens searches for the EcoRI recognition sequence GAATTC within a small educational enzyme set.', true),
      card('Common Mistake', 'A predicted site does not guarantee laboratory cleavage.', 'Methylation, DNA topology, enzyme conditions, sequence context, and sample quality can affect cleavage. Prediction does not replace laboratory validation.'),
      card('In the DNA Lab', 'Use the map as an educational screen.', 'Restriction Sites reports exact matches for six enzymes. It is not a complete digest simulator or laboratory protocol.'),
    ],
    sources: ['source-ncbi-methods'],
  },
  {
    title: 'Motifs',
    cards: [
      card('Definition', 'A motif search finds exact occurrences of a short pattern.', 'GenomeLens searches the submitted strand and reverse-complement strand for an exact A/T/G/C pattern and reports unique one-based intervals.'),
      card('Why It Matters', 'Matches can identify locations worth investigating.', 'A sequence motif may be associated with biological or technical features, but its relevance depends on organism, genomic context, strand, and evidence.'),
      card('Small Example', 'ATG appears at positions 1–3 and 7–9 in ATGAAAATG.', 'Exact searches can overlap. GenomeLens maps reverse-strand matches back to the coordinates of the submitted sequence.', true),
      card('Common Mistake', 'A motif match can occur by chance.', 'Short patterns are expected to occur in many unrelated sequences. A match alone does not prove binding, regulation, cleavage, or biological activity.'),
      card('In the DNA Lab', 'Review start, end, and strand for every site.', 'Motifs reports unique physical intervals. Palindromic matches observed on both strands are labeled both rather than counted twice.'),
    ],
    sources: ['source-ncbi-methods', 'source-ncbi-blast'],
  },
  {
    title: 'Sequence ambiguity',
    cards: [
      card('Definition', 'N represents an unresolved nucleotide.', 'In GenomeLens, N means that the base at a position is unknown among A, T, G, and C. It is not silently replaced with a guessed base.'),
      card('Why It Matters', 'Ambiguity reduces certainty in derived results.', 'N can create X symbols in translations, obscure motifs and restriction sites, and prevent reliable molecular-weight and melting-temperature estimates.'),
      card('Small Example', 'ATN translates to X.', 'Because ATN could represent several codons with different amino-acid meanings, GenomeLens displays X for that ambiguous codon.', true),
      card('Common Mistake', 'Deleting N can join bases that were not adjacent.', 'Removing internal N bases before analysis creates an artificial sequence and can produce misleading codons, motifs, and temperature estimates.'),
      card('In the DNA Lab', 'Check ambiguity before interpreting other views.', 'Complexity and Interpretation report N frequency. Treat all outputs near ambiguous positions with reduced confidence.'),
    ],
    sources: ['source-biopython', 'source-ncbi-methods'],
  },
  {
    title: 'How bioinformatics supports biotechnology',
    cards: [
      card('Definition', 'Bioinformatics applies computational methods to biological data.', 'Bioinformatics combines biology, computing, statistics, and data stewardship to organize, analyze, and communicate biological observations.'),
      card('Why It Matters', 'Computational work can make hypotheses testable and reproducible.', 'Well-documented analysis can support quality control, experiment design, comparison, and education while making assumptions visible.'),
      card('Small Example', 'A workflow can validate, transform, quantify, and report a sequence.', 'A reproducible sequence workflow records its input, method, parameters, coordinate system, assumptions, and output instead of presenting a result without context.', true),
      card('Common Mistake', 'A polished output is not experimental confirmation.', 'Computational predictions inherit input quality and model assumptions. Sequence analysis alone cannot establish clinical or medical significance.'),
      card('In the DNA Lab', 'Export results with their limitations.', 'GenomeLens supports transparent exploration and exports, but users must verify important findings with appropriate databases, domain expertise, and experiments.'),
    ],
    sources: ['source-ebi-training', 'source-ncbi-methods'],
  },
];

export const SOURCE_GROUPS = [
  {
    title: 'Genetics and molecular biology',
    sources: [
      { id: 'source-nhgri-glossary', institution: 'NHGRI', title: 'Talking Glossary of Genetic Terms', url: 'https://www.genome.gov/genetics-glossary', description: 'Clear definitions and educational explanations for foundational genetics and genomics terms.' },
      { id: 'source-nhgri-dna', institution: 'NHGRI', title: 'DNA', url: 'https://www.genome.gov/genetics-glossary/Deoxyribonucleic-Acid', description: 'An overview of DNA as the molecule that carries genetic information.' },
      { id: 'source-nhgri-transcription', institution: 'NHGRI', title: 'Transcription', url: 'https://www.genome.gov/genetics-glossary/Transcription', description: 'An explanation of how information in DNA is copied into RNA.' },
      { id: 'source-nhgri-translation', institution: 'NHGRI', title: 'Translation', url: 'https://www.genome.gov/genetics-glossary/Translation', description: 'An introduction to how a messenger RNA sequence directs protein synthesis.' },
      { id: 'source-nhgri-codon', institution: 'NHGRI', title: 'Codon', url: 'https://www.genome.gov/genetics-glossary/Codon', description: 'A definition of three-nucleotide codons and their role in genetic information.' },
      { id: 'source-nhgri-orf', institution: 'NHGRI', title: 'Open Reading Frame', url: 'https://www.genome.gov/genetics-glossary/Open-Reading-Frame', description: 'A learner-focused description of reading frames and stop-codon-free sequence regions.' },
    ],
  },
  {
    title: 'Sequence analysis methods and tools',
    sources: [
      { id: 'source-ncbi-orffinder', institution: 'NCBI', title: 'ORFfinder', url: 'https://www.ncbi.nlm.nih.gov/orffinder/', description: 'A reference tool for locating potential protein-coding regions and reviewing ORF parameters.' },
      { id: 'source-ncbi-blast', institution: 'NCBI', title: 'BLAST Command Line Applications User Manual', url: 'https://www.ncbi.nlm.nih.gov/books/NBK279684/', description: 'Official guidance for reproducible sequence-similarity searches with BLAST applications.' },
      { id: 'source-ncbi-methods', institution: 'NCBI', title: 'Principles and Methods of Sequence Analysis', url: 'https://www.ncbi.nlm.nih.gov/books/NBK20261/', description: 'Background on core concepts, assumptions, and methods used in biological sequence analysis.' },
    ],
  },
  {
    title: 'Training and software documentation',
    sources: [
      { id: 'source-ebi-training', institution: 'EMBL-EBI', title: 'Training', url: 'https://www.ebi.ac.uk/training/', description: 'Free bioinformatics learning materials and practical training from EMBL-EBI.' },
      { id: 'source-biopython', institution: 'Biopython', title: 'Documentation', url: 'https://biopython.org/docs/', description: 'Official documentation for the open-source biology tools used in GenomeLens calculations.' },
    ],
  },
];
