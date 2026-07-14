from typing import Any
from pydantic import BaseModel, Field, field_validator

class SequenceRequest(BaseModel):
    sequence: str = Field(max_length=1_100_000)

class AnalyzeRequest(SequenceRequest):
    minimum_orf_length: int = Field(default=30, ge=1, le=10_000)
    motif: str | None = Field(default=None, max_length=1_000)

class MotifRequest(SequenceRequest):
    motif: str = Field(max_length=1_000)

class CodonRequest(SequenceRequest):
    frame: int = Field(default=1, ge=1, le=3)

class AnalysisResponse(BaseModel):
    sequence: str
    metadata: dict[str, Any]
    statistics: dict[str, Any]
    transformations: dict[str, str]
    reading_frames: list[dict[str, Any]]
    orfs: list[dict[str, Any]]
    motif: dict[str, Any] | None
    restriction_sites: list[dict[str, Any]]
    codon_usage: dict[str, Any]
    complexity: dict[str, Any]
    interpretation: list[str]
