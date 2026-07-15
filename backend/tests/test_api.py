from fastapi.testclient import TestClient
from app.main import app
client=TestClient(app)
def test_health(): assert client.get('/api/health').json()['status']=='healthy'
def test_complete_analysis():
    response=client.post('/api/analyze',json={'sequence':'>demo\nCCCATGAAATAAGGG','minimum_orf_length':2,'motif':'ATG'})
    assert response.status_code==200
    data=response.json(); assert data['metadata']['fasta_header_detected'] is True
    assert data['orfs'][0]['protein']=='MK' and data['motif']['count']>=1
def test_invalid_request_has_helpful_error():
    response=client.post('/api/analyze',json={'sequence':'ATGB'})
    assert response.status_code==422 and 'Unsupported DNA' in response.json()['detail']

def test_multiple_fasta_records_return_clear_validation_error():
    response = client.post('/api/analyze', json={'sequence': '>one\nATG\n>two\nTAA'})
    assert response.status_code == 422
    assert response.json()['detail'] == (
        'GenomeLens currently supports one FASTA record at a time. '
        'Please submit or upload a single sequence.'
    )

def test_complete_analysis_has_specific_sequence_size_limit():
    response = client.post('/api/analyze', json={'sequence': 'ATGC' * 25_001})
    assert response.status_code == 422
    assert 'up to 100,000 nucleotides' in response.json()['detail']

def test_orf_truncation_metadata_is_exposed_by_api():
    response = client.post('/api/analyze', json={
        'sequence': 'ATGTAA' * 501,
        'minimum_orf_length': 1,
    })
    assert response.status_code == 200
    data = response.json()
    assert len(data['orfs']) == 500
    assert data['metadata']['orf_results_truncated'] is True
    assert 'truncated' in data['metadata']['orf_truncation_notice']
