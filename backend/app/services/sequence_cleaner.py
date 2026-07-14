import re

MAX_SEQUENCE_LENGTH = 1_000_000
VALID_BASES = set("ATGCN")

class SequenceValidationError(ValueError):
    pass

def clean_sequence(raw: str) -> tuple[str, bool, str | None]:
    if not raw or not raw.strip():
        raise SequenceValidationError("Enter a DNA sequence before running an analysis.")
    lines = raw.strip().splitlines()
    header = lines[0][1:].strip() if lines and lines[0].lstrip().startswith(">") else None
    sequence_lines = [line for line in lines if not line.lstrip().startswith(">")]
    sequence = re.sub(r"\s+", "", "".join(sequence_lines)).upper()
    invalid = sorted(set(sequence) - VALID_BASES)
    if invalid:
        raise SequenceValidationError(f"Unsupported DNA character(s): {', '.join(invalid)}. Use only A, T, G, C, or N.")
    if not sequence:
        raise SequenceValidationError("The input contains a FASTA header but no DNA sequence.")
    if len(sequence) > MAX_SEQUENCE_LENGTH:
        raise SequenceValidationError(f"Sequence exceeds the {MAX_SEQUENCE_LENGTH:,}-base limit.")
    if set(sequence) == {"N"}:
        raise SequenceValidationError("A sequence containing only N bases cannot produce a meaningful analysis.")
    return sequence, header is not None, header

def clean_motif(raw: str) -> str:
    motif = re.sub(r"\s+", "", raw or "").upper()
    if not motif:
        raise SequenceValidationError("Enter a motif to search for.")
    invalid = sorted(set(motif) - set("ATGC"))
    if invalid:
        raise SequenceValidationError(f"Invalid motif character(s): {', '.join(invalid)}. Motifs use A, T, G, and C.")
    return motif
