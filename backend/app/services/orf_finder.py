from Bio.Seq import Seq
from .transformations import reverse_complement

STOP_CODONS = {"TAA", "TAG", "TGA"}
MAX_RETURNED_ORFS = 500
MAX_RETURNED_PROTEIN_AA = 100_000


def find_orfs(sequence: str, minimum_aa_length: int = 30) -> tuple[list[dict], dict]:
    """Scan each strand/frame once and return bounded candidate ORFs.

    Within a frame, the first ATG after a stop starts a candidate and the next
    in-frame stop closes it. Nested starts are intentionally ignored. This makes
    scanning O(n); response construction is bounded by the result limits below.
    """
    results: list[dict] = []
    total_protein_aa = 0
    truncated = False
    length = len(sequence)

    for strand, source in (("forward", sequence), ("reverse", reverse_complement(sequence))):
        for offset in range(3):
            start: int | None = None
            frame_end = len(source) - ((len(source) - offset) % 3)

            for position in range(offset, frame_end, 3):
                codon = source[position:position + 3]
                if start is None:
                    if codon == "ATG":
                        start = position
                    continue
                if codon in STOP_CODONS:
                    truncated, total_protein_aa = _append_candidate(
                        results,
                        source,
                        strand,
                        length,
                        offset,
                        start,
                        position + 3,
                        True,
                        minimum_aa_length,
                        total_protein_aa,
                    )
                    start = None
                    if truncated:
                        break

            if not truncated and start is not None:
                truncated, total_protein_aa = _append_candidate(
                    results,
                    source,
                    strand,
                    length,
                    offset,
                    start,
                    frame_end,
                    False,
                    minimum_aa_length,
                    total_protein_aa,
                )
            if truncated:
                break
        if truncated:
            break

    notice = None
    if truncated:
        notice = (
            "ORF results were truncated to protect performance. GenomeLens returns "
            f"at most {MAX_RETURNED_ORFS:,} ORFs and {MAX_RETURNED_PROTEIN_AA:,} "
            "total amino acids of protein-sequence content."
        )
    return results, {
        "orf_results_truncated": truncated,
        "orf_truncation_notice": notice,
        "maximum_returned_orfs": MAX_RETURNED_ORFS,
        "maximum_returned_protein_aa": MAX_RETURNED_PROTEIN_AA,
        "returned_protein_aa": total_protein_aa,
    }


def _append_candidate(
    results: list[dict],
    source: str,
    strand: str,
    sequence_length: int,
    offset: int,
    start: int,
    end: int,
    stop_found: bool,
    minimum_aa_length: int,
    total_protein_aa: int,
) -> tuple[bool, int]:
    protein_length = (end - start) // 3 - int(stop_found)
    if protein_length < minimum_aa_length:
        return False, total_protein_aa
    if len(results) >= MAX_RETURNED_ORFS or total_protein_aa + protein_length > MAX_RETURNED_PROTEIN_AA:
        return True, total_protein_aa

    protein = str(Seq(source[start:end]).translate()).rstrip("*")
    if strand == "forward":
        ui_start, ui_end = start + 1, end
    else:
        ui_start, ui_end = sequence_length - end + 1, sequence_length - start
    results.append({
        "id": len(results) + 1,
        "frame": offset + 1,
        "strand": strand,
        "start": ui_start,
        "end": ui_end,
        "nucleotide_length": end - start,
        "amino_acid_length": protein_length,
        "protein": protein,
        "stop_found": stop_found,
    })
    return False, total_protein_aa + protein_length
