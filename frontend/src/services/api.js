const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export const REQUEST_TIMEOUT_MS = 20_000;

export function normalizeApiError(detail) {
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    return detail.map((error) => {
      const path = Array.isArray(error.loc)
        ? error.loc.filter((part) => part !== 'body').join('.')
        : '';
      return `${path ? `${path}: ` : ''}${error.msg || 'Invalid value'}`;
    }).join(' ');
  }
  return 'The analysis could not be completed.';
}

export async function analyzeSequence(payload, { signal, timeoutMs = REQUEST_TIMEOUT_MS } = {}) {
  const controller = new AbortController();
  let timedOut = false;
  const cancelFromCaller = () => controller.abort();
  signal?.addEventListener('abort', cancelFromCaller, { once: true });
  const timeout = window.setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetch(`${API_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(normalizeApiError(data.detail));
    return data;
  } catch (error) {
    if (timedOut) {
      throw new Error('The analysis server took too long to respond. Please retry, or use a shorter sequence if the problem continues.');
    }
    if (signal?.aborted) {
      const cancellation = new Error('Analysis canceled.');
      cancellation.name = 'AbortError';
      throw cancellation;
    }
    if (error.name === 'AbortError') throw error;
    if (error instanceof TypeError) {
      throw new Error('GenomeLens could not reach the analysis server. Check your connection and try again.');
    }
    throw error;
  } finally {
    window.clearTimeout(timeout);
    signal?.removeEventListener('abort', cancelFromCaller);
  }
}
