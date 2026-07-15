# GenomeLens API

Modular FastAPI service for validated educational DNA analysis. Install `requirements.txt`, run `uvicorn app.main:app --reload`, and open `/docs` for request and response schemas. Configure exact browser origins with `ALLOWED_ORIGINS`. Run `python -m pytest` from this directory.

The complete-analysis endpoint accepts one raw sequence or one FASTA record up to 100,000 cleaned nucleotides. Sequence-only endpoints accept up to 1,000,000. Multi-record FASTA is rejected. ORF scanning is linear across six frames, ignores nested starts, and returns at most 500 candidates and 100,000 total protein amino acids; truncation is explicit in response metadata. Coordinates are one-based and inclusive on the submitted sequence. Molecular weight represents Biopython's single-stranded linear DNA calculation, and molecular weight and Tm are unavailable when N is present. Translation uses NCBI standard genetic code 1 and ATG-only starts.
