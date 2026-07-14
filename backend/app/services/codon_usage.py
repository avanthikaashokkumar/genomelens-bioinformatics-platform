from Bio.Data import CodonTable

TABLE = CodonTable.unambiguous_dna_by_id[1]
def analyze(sequence: str, frame: int = 1) -> dict:
    source = sequence[frame-1:]
    codons = [source[i:i+3] for i in range(0, len(source)-2, 3)]
    counts = {c: codons.count(c) for c in sorted(set(codons))}
    rows = []
    for codon, count in counts.items():
        aa = "*" if codon in TABLE.stop_codons else TABLE.forward_table.get(codon, "X")
        rows.append({"codon": codon, "count": count, "frequency": round(count / len(codons), 5) if codons else 0, "amino_acid": aa, "is_stop": aa == "*"})
    most = sorted(rows, key=lambda x: (-x["count"], x["codon"]))[:5]
    return {"frame": frame, "total_codons": len(codons), "ignored_trailing_bases": len(source) % 3, "codons": rows, "most_common": most, "stop_codon_count": sum(r["count"] for r in rows if r["is_stop"])}
