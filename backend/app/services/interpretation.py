def build(stats: dict, orfs: list[dict], complexity: dict) -> list[str]:
    gc = stats["gc_content"]
    level = "relatively low" if gc < 40 else "moderate" if gc <= 60 else "relatively high"
    notes = [f"GC content is {level} at {gc:.1f}% using educational thresholds of <40%, 40–60%, and >60%.", f"{len(orfs)} candidate ORF(s) met the selected threshold. ORFs are possible coding regions, but sequence analysis alone cannot prove gene identity or function."]
    if complexity["ambiguous_percentage"]:
        notes.append(f"Ambiguous N bases make up {complexity['ambiguous_percentage']:.2f}% of the sequence and reduce confidence in translations and derived estimates.")
    if stats["melting_temperature_c"] is None:
        notes.append("Melting temperature is unavailable because ambiguous N bases prevent a reliable educational estimate.")
    else:
        notes.append("The melting temperature is an approximation under assumed conditions, not a laboratory protocol.")
    notes.append("Results are educational and must not be used for medical diagnosis.")
    return notes
