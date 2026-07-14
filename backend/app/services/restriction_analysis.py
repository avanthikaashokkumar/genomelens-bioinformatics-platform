ENZYMES = {"EcoRI": "GAATTC", "BamHI": "GGATCC", "HindIII": "AAGCTT", "NotI": "GCGGCCGC", "PstI": "CTGCAG", "XhoI": "CTCGAG"}
CUT_OFFSETS = {"EcoRI": 1, "BamHI": 1, "HindIII": 1, "NotI": 2, "PstI": 5, "XhoI": 1}

def restriction_sites(sequence: str) -> list[dict]:
    results = []
    for name, recognition in ENZYMES.items():
        starts = [i for i in range(len(sequence)-len(recognition)+1) if sequence[i:i+len(recognition)] == recognition]
        results.append({"enzyme": name, "recognition_sequence": recognition, "site_count": len(starts), "cut_positions": [i + CUT_OFFSETS[name] + 1 for i in starts]})
    return results
