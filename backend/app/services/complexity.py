import math

def calculate(sequence: str) -> dict:
    entropy = -sum((sequence.count(b)/len(sequence)) * math.log2(sequence.count(b)/len(sequence)) for b in set(sequence))
    longest_base, longest_run, current_base, current_run = sequence[0], 1, sequence[0], 1
    for base in sequence[1:]:
        if base == current_base:
            current_run += 1
        else:
            current_base, current_run = base, 1
        if current_run > longest_run:
            longest_base, longest_run = current_base, current_run
    alphabet_size = len(set("ATGCN") if "N" in sequence else set("ATGC"))
    return {
        "unique_nucleotide_count": len(set(sequence)),
        "shannon_entropy": round(entropy, 4),
        "entropy_label": "base-composition entropy",
        "entropy_maximum_bits": round(math.log2(alphabet_size), 4),
        "ambiguous_percentage": round(sequence.count("N") / len(sequence) * 100, 3),
        "longest_homopolymer": {"base": longest_base, "length": longest_run},
        "explanation": (
            f"Base-composition entropy summarizes symbol diversity from 0 to {math.log2(alphabet_size):.3f} "
            f"bits for the allowed {'A/T/G/C/N' if 'N' in sequence else 'A/T/G/C'} alphabet. "
            "It is not a complete measure of biological sequence complexity. A homopolymer is a consecutive run of one base."
        ),
    }
