import pytest

from app.services.codon_usage import analyze
from app.services.complexity import calculate as sequence_complexity
from app.services.interpretation import build as interpretation
from app.services.motif_search import search
from app.services.orf_finder import (
    MAX_RETURNED_ORFS,
    MAX_RETURNED_PROTEIN_AA,
    find_orfs,
)
from app.services.restriction_analysis import restriction_sites
from app.services.sequence_cleaner import (
    MULTI_FASTA_ERROR,
    SequenceValidationError,
    clean_motif,
    clean_sequence,
)
from app.services.sequence_statistics import calculate as stats
from app.services.transformations import reverse_complement, transcribe, translate
from app.services.translation import six_frames


def test_raw_sequence_cleaning():
    assert clean_sequence(" atg c\nN ") == ("ATGCN", False, None)


def test_single_fasta_record_parsing():
    assert clean_sequence(">sample one\natgc\nTT") == ("ATGCTT", True, "sample one")


def test_leading_whitespace_before_fasta_header():
    assert clean_sequence("   >sample\nATGC") == ("ATGC", True, "sample")


def test_multiple_fasta_records_are_rejected_without_concatenation():
    with pytest.raises(SequenceValidationError, match="one FASTA record at a time") as exc:
        clean_sequence(">first\nATG\n  >second\nTAA")
    assert str(exc.value) == MULTI_FASTA_ERROR


@pytest.mark.parametrize("raw", ["", ">header\n", "NNNN"])
def test_unusable_sequences(raw):
    with pytest.raises(SequenceValidationError):
        clean_sequence(raw)


def test_invalid_characters_are_identified():
    with pytest.raises(SequenceValidationError, match="B, Z"):
        clean_sequence("ATGBZ")


def test_counts_and_gc_ignore_n_in_denominator():
    result = stats("AATTGGCCNN")
    assert result["counts"] == {"A": 2, "T": 2, "G": 2, "C": 2, "N": 2}
    assert result["gc_content"] == 50


def test_single_stranded_linear_dna_molecular_weight_matches_biopython_reference():
    result = stats("ATGC")
    assert result["molecular_weight_da"] == pytest.approx(1253.80, abs=0.01)
    assert result["molecular_weight_species"] == "single-stranded linear DNA"


def test_ambiguous_base_makes_mass_and_tm_unavailable():
    result = stats("AAAAAAANCCCCCCC")
    assert result["molecular_weight_da"] is None
    assert result["melting_temperature_c"] is None
    assert "N bases" in result["melting_temperature_note"]


def test_reverse_complement():
    assert reverse_complement("ATGCN") == "NGCAT"


def test_transcription():
    assert transcribe("ATGCT") == "AUGCU"


def test_translation_and_ambiguous_codon():
    assert translate("ATGNNNTAA") == "MX*"


def test_incomplete_codon_is_ignored():
    assert translate("ATGA") == "M"


def test_six_frames_returns_all_strands():
    frames = six_frames("ATGAAATAG")
    assert len(frames) == 6
    assert {frame["strand"] for frame in frames} == {"forward", "reverse"}


def test_orf_detection_uses_one_based_inclusive_coordinates():
    results, metadata = find_orfs("CCCATGAAATAAGGG", 2)
    result = results[0]
    assert (result["start"], result["end"], result["protein"], result["stop_found"]) == (
        4,
        12,
        "MK",
        True,
    )
    assert metadata["orf_results_truncated"] is False


def test_reverse_orf_coordinates_map_to_submitted_sequence():
    results, _ = find_orfs("CCCTTATTTCATGGG", 2)
    result = next(candidate for candidate in results if candidate["strand"] == "reverse")
    assert (result["start"], result["end"]) == (4, 12)


def test_atg_rich_input_is_scanned_without_nested_duplicate_orfs():
    results, metadata = find_orfs("ATG" * 10 + "TAA", 1)
    forward = [result for result in results if result["strand"] == "forward"]
    assert len(forward) == 1
    assert forward[0]["amino_acid_length"] == 10
    assert metadata["orf_results_truncated"] is False


def test_stop_free_input_returns_a_bounded_boundary_candidate():
    results, metadata = find_orfs("ATG" + "AAA" * 2000, 1)
    assert len(results) == 1
    assert results[0]["stop_found"] is False
    assert results[0]["amino_acid_length"] == 2001
    assert metadata["returned_protein_aa"] == 2001


def test_orf_count_cap_returns_truncation_notice():
    results, metadata = find_orfs("ATGTAA" * (MAX_RETURNED_ORFS + 1), 1)
    assert len(results) == MAX_RETURNED_ORFS
    assert metadata["orf_results_truncated"] is True
    assert "truncated" in metadata["orf_truncation_notice"]


def test_total_protein_content_cap_prevents_enormous_response():
    results, metadata = find_orfs("ATG" + "AAA" * MAX_RETURNED_PROTEIN_AA, 1)
    assert results == []
    assert metadata["orf_results_truncated"] is True
    assert metadata["returned_protein_aa"] == 0


def test_reverse_motif_coordinates_are_mapped_to_submitted_sequence():
    result = search("ATGCCC", "GGG")
    assert result["matches"] == [{"start": 4, "end": 6, "strand": "reverse"}]


def test_overlapping_motif_positions_are_preserved_as_unique_sites():
    result = search("ATATAT", "ATA")
    assert result["matches"] == [
        {"start": 1, "end": 3, "strand": "forward"},
        {"start": 2, "end": 4, "strand": "reverse"},
        {"start": 3, "end": 5, "strand": "forward"},
        {"start": 4, "end": 6, "strand": "reverse"},
    ]


def test_palindromic_motif_is_not_counted_twice():
    result = search("AGAATTCT", "GAATTC")
    assert result["count"] == 1
    assert result["matches"] == [{"start": 2, "end": 7, "strand": "both"}]


def test_restriction_detection():
    eco = next(item for item in restriction_sites("AAAAGAATTCTT") if item["enzyme"] == "EcoRI")
    assert eco["site_count"] == 1
    assert eco["cut_positions"] == [6]


def test_codon_usage_and_stop():
    result = analyze("ATGATGTAAC", 1)
    assert result["total_codons"] == 3
    assert result["ignored_trailing_bases"] == 1
    assert next(item for item in result["codons"] if item["codon"] == "ATG")["count"] == 2
    assert result["stop_codon_count"] == 1


def test_complexity_describes_five_symbol_entropy_limit_when_n_is_present():
    result = sequence_complexity("ATGCN")
    assert result["entropy_label"] == "base-composition entropy"
    assert result["entropy_maximum_bits"] == pytest.approx(2.3219)
    assert "not a complete measure" in result["explanation"]


def test_interpretation_does_not_present_ambiguous_tm_as_an_estimate():
    statistics = stats("ATGCN")
    notes = interpretation(statistics, [], sequence_complexity("ATGCN"))
    assert any("Melting temperature is unavailable" in note for note in notes)


def test_invalid_motif():
    with pytest.raises(SequenceValidationError):
        clean_motif("ATN")
