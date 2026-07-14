from Bio.Seq import Seq

def complement(sequence: str) -> str:
    return str(Seq(sequence).complement())

def reverse_complement(sequence: str) -> str:
    return str(Seq(sequence).reverse_complement())

def transcribe(sequence: str) -> str:
    return str(Seq(sequence).transcribe())

def translate(sequence: str) -> str:
    usable = sequence[: len(sequence) - len(sequence) % 3]
    return str(Seq(usable).translate()) if usable else ""
