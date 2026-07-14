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
    return {"unique_nucleotide_count": len(set(sequence)), "shannon_entropy": round(entropy, 4), "ambiguous_percentage": round(sequence.count("N")/len(sequence)*100, 3), "longest_homopolymer": {"base": longest_base, "length": longest_run}, "explanation": "Entropy summarizes base diversity (0 is uniform; up to ~2 bits for balanced A/T/G/C). A homopolymer is a consecutive run of one base."}
