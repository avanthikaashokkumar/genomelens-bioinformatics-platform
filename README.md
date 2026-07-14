# GenomeLens

> Explore sequences. Understand biology. Learn through data.

GenomeLens is a full-stack educational bioinformatics platform for analyzing DNA and understanding the biology behind each result. Version 1 delivers a complete DNA Sequence Lab with transparent methods, interactive visualizations, scientific interpretation, and reproducible exports.

![GenomeLens homepage screenshot placeholder](docs/screenshots/home.png)
![GenomeLens DNA Lab screenshot placeholder](docs/screenshots/dna-lab.png)

## Features

- Raw DNA, FASTA paste, and `.fasta`, `.fa`, or `.txt` upload
- Validated A/T/G/C/N input up to 1,000,000 cleaned bases
- Counts, percentages, GC/AT content, ratio, molecular weight, Tm, and complexity
- Complement, reverse complement, transcription, primary and six-frame translation
- Six-frame candidate ORF detection with selectable minimum length
- Exact motif searches on both strands
- Educational EcoRI, BamHI, HindIII, NotI, PstI, and XhoI site analysis
- Codon frequency analysis and interactive charts
- Plain-language, calculation-grounded interpretation
- JSON, CSV, TXT, and printable HTML exports
- Learning hub, glossary, documentation, responsible-use and privacy guidance
- Responsive, keyboard-friendly interface with clear focus and error states

## Scientific methods

GenomeLens uses NCBI standard genetic code 1. Positions shown to users are one-based and inclusive. `N` is accepted; ambiguous codons translate to `X`. Incomplete trailing codons are ignored. ORFs begin at `ATG` and extend to the first in-frame `TAA`, `TAG`, or `TGA`, or to the sequence boundary when no stop exists. Short-sequence Tm uses the Wallace rule; longer sequences use Biopython's GC empirical formula (valueset 7). Molecular weight is an average-residue estimate.

These calculations describe sequence features. They do not identify a gene, prove function, validate a laboratory protocol, or support medical diagnosis.

## Stack

- React 19, Vite 8, React Router, Recharts, Vitest
- Python 3.10+, FastAPI, Pydantic, Biopython, pandas, NumPy, Pytest
- Vercel-ready frontend and Render-ready backend

## Architecture

```text
GenomeLens/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── models/schemas.py
│   │   ├── routes/api.py
│   │   └── services/          # independent scientific calculations
│   ├── tests/
│   ├── requirements.txt
│   └── render.yaml
├── frontend/
│   ├── src/
│   │   ├── components/        # input, navigation, analysis views
│   │   ├── data/              # demos and learning content
│   │   ├── pages/
│   │   ├── services/api.js
│   │   ├── styles/
│   │   └── utils/export.js
│   ├── package.json
│   └── vercel.json
├── .github/
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
└── LICENSE
```

The API route layer validates requests and composes small service modules. The frontend calls one complete-analysis endpoint, then presents the immutable response across focused views. Future analysis domains can add new service and route modules without coupling to the DNA workflow.

## Local setup

### Backend (macOS/Linux)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Windows PowerShell activation: `.venv\Scripts\Activate.ps1`

The API runs at `http://localhost:8000`; interactive OpenAPI docs are at `http://localhost:8000/docs`.

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The interface runs at `http://localhost:5173`.

## Environment variables

| Variable | Location | Purpose | Example |
|---|---|---|---|
| `VITE_API_URL` | Frontend | Public backend base URL | `http://localhost:8000` |
| `ALLOWED_ORIGINS` | Backend | Comma-separated exact CORS origins | `http://localhost:5173` |

No API key is required. Never put private credentials in `VITE_` variables; Vite exposes them to the browser.

## Tests and quality checks

```bash
cd backend && pytest
cd frontend && npm test
cd frontend && npm run lint
cd frontend && npm run build
```

Tests cover cleaning, FASTA, invalid and ambiguous bases, statistics, transformations, translation, reading frames, ORFs, motifs, restriction sites, codons, API behavior, example loading, submission, errors, result rendering, and reset.

## API examples

```bash
curl http://localhost:8000/api/health
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"sequence":"ATGAAATAA","minimum_orf_length":2,"motif":"ATG"}'
```

Additional endpoints: `POST /api/motif-search`, `POST /api/restriction-sites`, and `POST /api/codon-usage`. All models and responses are documented in OpenAPI.

## Deploy

### Backend on Render

Create a Web Service with root directory `backend` (or use `backend/render.yaml`), build command `pip install -r requirements.txt`, and start command `uvicorn app.main:app --host 0.0.0.0 --port $PORT`. Set `ALLOWED_ORIGINS` to the exact Vercel production URL.

### Frontend on Vercel

Import the repository, set root directory to `frontend`, framework preset to Vite, build command to `npm run build`, and output directory to `dist`. Set `VITE_API_URL` to the HTTPS Render API URL and redeploy.

## Privacy and security

Inputs are strictly validated and analyzed in memory. GenomeLens does not write uploaded sequence files or persist submitted sequence content by default. Browser file filters are convenience controls; the backend remains the source of validation. Do not submit sensitive genomic data to a deployment you do not administer.

## Limitations

GenomeLens does not perform similarity searches, gene annotation, quality-score analysis, circular genome handling, alternative-code translation, clinical interpretation, or experimental confirmation. The enzyme set is intentionally small. Tm and mass are educational estimates whose real values depend on chemical and laboratory conditions.

## Roadmap

1. Version 1 — DNA Sequence Lab
2. Version 2 — Protein Analysis
3. Version 3 — Genetic Variant Explorer
4. Version 4 — Microbiome Diversity
5. Version 5 — Guided research case studies

## Contributing and license

See [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). GenomeLens is available under the [MIT License](LICENSE).

## Suggested resume bullets

- Built a full-stack bioinformatics learning platform with React, FastAPI, and Biopython, implementing validated DNA statistics, six-frame translation, ORF/motif/restriction analysis, and reproducible multi-format exports.
- Designed and tested an accessible scientific interface that translates computational results into responsible biological interpretation, with modular deployment-ready architecture for Vercel and Render.
