import { analyzeSequence, normalizeApiError, REQUEST_TIMEOUT_MS } from '../services/api';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

it('normalizes structured FastAPI validation errors into readable field messages', () => {
  expect(normalizeApiError([
    { loc: ['body', 'minimum_orf_length'], msg: 'Input should be greater than or equal to 1' },
    { loc: ['body', 'motif'], msg: 'String should have at most 1000 characters' },
  ])).toBe(
    'minimum_orf_length: Input should be greater than or equal to 1 '
    + 'motif: String should have at most 1000 characters',
  );
});

it('aborts a slow request and provides retry guidance', async () => {
  vi.useFakeTimers();
  global.fetch = vi.fn((_, options) => new Promise((resolve, reject) => {
    options.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
  }));
  const request = analyzeSequence({ sequence: 'ATGC' });
  const rejection = expect(request).rejects.toThrow('Please retry');
  await vi.advanceTimersByTimeAsync(REQUEST_TIMEOUT_MS);
  await rejection;
  expect(fetch.mock.calls[0][1].signal.aborted).toBe(true);
});

it('honors caller cancellation without presenting it as a network failure', async () => {
  global.fetch = vi.fn((_, options) => new Promise((resolve, reject) => {
    options.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
  }));
  const controller = new AbortController();
  const request = analyzeSequence({ sequence: 'ATGC' }, { signal: controller.signal });
  controller.abort();
  await expect(request).rejects.toMatchObject({ name: 'AbortError', message: 'Analysis canceled.' });
});
