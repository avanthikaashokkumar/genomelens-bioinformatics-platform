from fastapi import APIRouter, HTTPException
from ..models.schemas import AnalyzeRequest, AnalysisResponse, MotifRequest, SequenceRequest, CodonRequest
from ..services.sequence_cleaner import (
    MAX_ANALYSIS_SEQUENCE_LENGTH,
    clean_sequence,
    clean_motif,
    SequenceValidationError,
)
from ..services import sequence_statistics, transformations, translation, orf_finder, motif_search, restriction_analysis, codon_usage, complexity, interpretation

router = APIRouter(prefix="/api")

def validated(raw: str):
    try:
        return clean_sequence(raw)
    except SequenceValidationError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

@router.get("/health")
def health(): return {"status": "healthy", "service": "GenomeLens API"}

@router.post("/analyze", response_model=AnalysisResponse)
def analyze(request: AnalyzeRequest):
    sequence, fasta, header = validated(request.sequence)
    if len(sequence) > MAX_ANALYSIS_SEQUENCE_LENGTH:
        raise HTTPException(
            status_code=422,
            detail=(
                f"Complete analysis supports up to {MAX_ANALYSIS_SEQUENCE_LENGTH:,} nucleotides "
                "because it produces large sequence outputs. Submit a shorter sequence and try again."
            ),
        )
    stats = sequence_statistics.calculate(sequence)
    orfs, orf_metadata = orf_finder.find_orfs(sequence, request.minimum_orf_length)
    comp = complexity.calculate(sequence)
    motif = None
    if request.motif:
        try: motif = motif_search.search(sequence, clean_motif(request.motif))
        except SequenceValidationError as exc: raise HTTPException(status_code=422, detail=str(exc)) from exc
    return {"sequence": sequence, "metadata": {"fasta_header_detected": fasta, "fasta_header": header, "minimum_orf_length": request.minimum_orf_length, "maximum_analysis_sequence_length": MAX_ANALYSIS_SEQUENCE_LENGTH, **orf_metadata}, "statistics": stats, "transformations": {"complement": transformations.complement(sequence), "reverse_complement": transformations.reverse_complement(sequence), "rna_transcript": transformations.transcribe(sequence), "primary_translation": transformations.translate(sequence)}, "reading_frames": translation.six_frames(sequence), "orfs": orfs, "motif": motif, "restriction_sites": restriction_analysis.restriction_sites(sequence), "codon_usage": codon_usage.analyze(sequence), "complexity": comp, "interpretation": interpretation.build(stats, orfs, comp)}

@router.post("/motif-search")
def motifs(request: MotifRequest):
    sequence, _, _ = validated(request.sequence)
    try: motif = clean_motif(request.motif)
    except SequenceValidationError as exc: raise HTTPException(status_code=422, detail=str(exc)) from exc
    return motif_search.search(sequence, motif)

@router.post("/restriction-sites")
def restrictions(request: SequenceRequest):
    sequence, _, _ = validated(request.sequence); return restriction_analysis.restriction_sites(sequence)

@router.post("/codon-usage")
def codons(request: CodonRequest):
    sequence, _, _ = validated(request.sequence); return codon_usage.analyze(sequence, request.frame)
