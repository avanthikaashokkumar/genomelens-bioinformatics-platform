import pytest
from app.services.sequence_cleaner import clean_sequence, clean_motif, SequenceValidationError
from app.services.sequence_statistics import calculate as stats
from app.services.transformations import reverse_complement, transcribe, translate
from app.services.translation import six_frames
from app.services.orf_finder import find_orfs
from app.services.motif_search import search
from app.services.restriction_analysis import restriction_sites
from app.services.codon_usage import analyze

def test_raw_sequence_cleaning(): assert clean_sequence(" atg c\nN ") == ("ATGCN", False, None)
def test_fasta_parsing(): assert clean_sequence(">sample one\natgc\nTT")== ("ATGCTT", True, "sample one")
@pytest.mark.parametrize("raw",["",">header\n", "NNNN"])
def test_unusable_sequences(raw):
    with pytest.raises(SequenceValidationError): clean_sequence(raw)
def test_invalid_characters_are_identified():
    with pytest.raises(SequenceValidationError, match="B, Z"): clean_sequence("ATGBZ")
def test_counts_and_gc_ignore_n_in_denominator():
    result=stats("AATTGGCCNN")
    assert result["counts"]=={"A":2,"T":2,"G":2,"C":2,"N":2}
    assert result["gc_content"]==50
def test_reverse_complement(): assert reverse_complement("ATGCN")=="NGCAT"
def test_transcription(): assert transcribe("ATGCT")=="AUGCU"
def test_translation_and_ambiguous_codon(): assert translate("ATGNNNTAA") == "MX*"
def test_incomplete_codon_is_ignored(): assert translate("ATGA") == "M"
def test_six_frames_returns_all_strands():
    frames=six_frames("ATGAAATAG")
    assert len(frames)==6 and {f["strand"] for f in frames}=={"forward","reverse"}
def test_orf_detection_one_based_coordinates():
    result=find_orfs("CCCATGAAATAAGGG",2)[0]
    assert (result["start"],result["end"],result["protein"],result["stop_found"])==(4,12,"MK",True)
def test_motif_overlapping_positions_both_strands():
    result=search("ATATAT","ATA")
    assert result["forward_positions"]==[1,3]
    assert result["reverse_complement_positions"]==[1,3]
def test_restriction_detection():
    eco=next(x for x in restriction_sites("AAAAGAATTCTT") if x["enzyme"]=="EcoRI")
    assert eco["site_count"]==1 and eco["cut_positions"]==[6]
def test_codon_usage_and_stop():
    result=analyze("ATGATGTAAC",1)
    assert result["total_codons"]==3 and result["ignored_trailing_bases"]==1
    assert next(x for x in result["codons"] if x["codon"]=="ATG")["count"]==2
    assert result["stop_codon_count"]==1
def test_invalid_motif():
    with pytest.raises(SequenceValidationError): clean_motif("ATN")
