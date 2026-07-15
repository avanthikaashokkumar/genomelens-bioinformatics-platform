from .transformations import reverse_complement

def _positions(sequence: str, motif: str) -> list[int]:
    return [i for i in range(len(sequence) - len(motif) + 1) if sequence[i:i + len(motif)] == motif]

def search(sequence: str, motif: str) -> dict:
    sequence_length = len(sequence)
    motif_length = len(motif)
    sites: dict[tuple[int, int], set[str]] = {}

    for position in _positions(sequence, motif):
        interval = (position + 1, position + motif_length)
        sites.setdefault(interval, set()).add("forward")

    for position in _positions(reverse_complement(sequence), motif):
        interval = (
            sequence_length - (position + motif_length) + 1,
            sequence_length - position,
        )
        sites.setdefault(interval, set()).add("reverse")

    matches = [
        {
            "start": start,
            "end": end,
            "strand": "both" if strands == {"forward", "reverse"} else next(iter(strands)),
        }
        for (start, end), strands in sorted(sites.items())
    ]
    return {"motif": motif, "count": len(matches), "matches": matches}
