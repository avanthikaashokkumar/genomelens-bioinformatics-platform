# GenomeLens frontend

React/Vite interface for the GenomeLens DNA Sequence Lab and learning content. Copy `.env.example` to `.env`, set `VITE_API_URL`, run `npm install`, then `npm run dev`. Quality commands: `npm test`, `npm run lint`, and `npm run build`.

The lab validates the 100,000-nucleotide complete-analysis limit and single-record FASTA format before submission, cancels reset or unmounted requests, and times out stalled requests after 20 seconds. The Learn page contains accessible expandable lesson cards and grouped authoritative sources. See the in-app Documentation page and root README for scientific assumptions and output limits.
