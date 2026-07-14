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
