from Bio.SeqUtils import molecular_weight, MeltingTemp

def calculate(sequence: str) -> dict:
    length = len(sequence)
    counts = {base: sequence.count(base) for base in "ATGCN"}
    percentages = {base: round(counts[base] / length * 100, 3) for base in counts}
    known = counts["A"] + counts["T"] + counts["G"] + counts["C"]
    gc = (counts["G"] + counts["C"]) / known * 100 if known else 0
    at = (counts["A"] + counts["T"]) / known * 100 if known else 0
    # Biopython cannot calculate ambiguous dsDNA molecular weight; use standard average residues.
    weights = {"A": 313.21, "T": 304.20, "G": 329.21, "C": 289.18, "N": 308.95}
    mw = sum(weights[b] * counts[b] for b in counts) - max(0, length - 1) * 18.015
    canonical = sequence.replace("N", "")
    if len(canonical) < 2:
        tm = None
    elif len(canonical) < 14:
        tm = 2 * (canonical.count("A") + canonical.count("T")) + 4 * (canonical.count("G") + canonical.count("C"))
    else:
        tm = MeltingTemp.Tm_GC(canonical, valueset=7)
    return {"length": length, "counts": counts, "percentages": percentages, "gc_content": round(gc, 3), "at_content": round(at, 3), "gc_at_ratio": round(gc / at, 4) if at else None, "molecular_weight_da": round(mw, 2), "melting_temperature_c": round(tm, 2) if tm is not None else None, "divisible_by_three": length % 3 == 0}
