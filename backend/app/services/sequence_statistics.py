from Bio.SeqUtils import molecular_weight, MeltingTemp

def calculate(sequence: str) -> dict:
    length = len(sequence)
    counts = {base: sequence.count(base) for base in "ATGCN"}
    percentages = {base: round(counts[base] / length * 100, 3) for base in counts}
    known = counts["A"] + counts["T"] + counts["G"] + counts["C"]
    gc = (counts["G"] + counts["C"]) / known * 100 if known else 0
    at = (counts["A"] + counts["T"]) / known * 100 if known else 0
    ambiguous = counts["N"] > 0
    mw = None if ambiguous else molecular_weight(
        sequence,
        seq_type="DNA",
        double_stranded=False,
        circular=False,
    )
    if ambiguous or length < 2:
        tm = None
    elif length < 14:
        tm = MeltingTemp.Tm_Wallace(sequence)
    else:
        tm = MeltingTemp.Tm_GC(sequence, valueset=7)
    return {
        "length": length,
        "counts": counts,
        "percentages": percentages,
        "gc_content": round(gc, 3),
        "at_content": round(at, 3),
        "gc_at_ratio": round(gc / at, 4) if at else None,
        "molecular_weight_da": round(mw, 2) if mw is not None else None,
        "molecular_weight_species": "single-stranded linear DNA",
        "melting_temperature_c": round(tm, 2) if tm is not None else None,
        "melting_temperature_note": (
            "Unavailable because N bases make this educational estimate unreliable."
            if ambiguous else
            "Educational estimate; experimental conditions can substantially change melting temperature."
        ),
        "divisible_by_three": length % 3 == 0,
    }
