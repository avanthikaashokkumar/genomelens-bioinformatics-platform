from Bio.Seq import Seq
from .transformations import reverse_complement

def find_orfs(sequence: str, minimum_aa_length: int = 30) -> list[dict]:
    results = []
    length = len(sequence)
    for strand, source in (("forward", sequence), ("reverse", reverse_complement(sequence))):
        for offset in range(3):
            for start in range(offset, len(source) - 2, 3):
                if source[start:start+3] != "ATG":
                    continue
                stop = None
                for pos in range(start + 3, len(source) - 2, 3):
                    if source[pos:pos+3] in {"TAA", "TAG", "TGA"}:
                        stop = pos
                        break
                end = stop + 3 if stop is not None else len(source) - ((len(source) - start) % 3)
                protein = str(Seq(source[start:end]).translate()).rstrip("*")
                if len(protein) < minimum_aa_length:
                    continue
                if strand == "forward":
                    ui_start, ui_end = start + 1, end
                else:
                    ui_start, ui_end = length - end + 1, length - start
                results.append({"id": len(results) + 1, "frame": offset + 1, "strand": strand, "start": ui_start, "end": ui_end, "nucleotide_length": end-start, "amino_acid_length": len(protein), "protein": protein, "stop_found": stop is not None})
    return results
