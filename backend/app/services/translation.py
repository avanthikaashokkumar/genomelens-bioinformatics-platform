from .transformations import reverse_complement, translate

def six_frames(sequence: str) -> list[dict]:
    reverse = reverse_complement(sequence)
    frames = []
    for strand, source in (("forward", sequence), ("reverse", reverse)):
        for offset in range(3):
            protein = translate(source[offset:])
            frames.append({"name": f"{strand.title()} frame {offset + 1}", "strand": strand, "frame": offset + 1, "offset": offset, "protein": protein, "amino_acid_length": len(protein), "start_codons": protein.count("M"), "stop_codons": protein.count("*")})
    return frames
