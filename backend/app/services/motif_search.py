from .transformations import reverse_complement

def _positions(sequence: str, motif: str) -> list[int]:
    return [i + 1 for i in range(len(sequence) - len(motif) + 1) if sequence[i:i+len(motif)] == motif]

def search(sequence: str, motif: str) -> dict:
    forward = _positions(sequence, motif)
    reverse = _positions(reverse_complement(sequence), motif)
    return {"motif": motif, "count": len(forward) + len(reverse), "forward_positions": forward, "reverse_complement_positions": reverse}
