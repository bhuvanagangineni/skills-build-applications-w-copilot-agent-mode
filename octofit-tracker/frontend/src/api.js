const codespaceName = typeof import.meta.env.VITE_CODESPACE_NAME === 'string'
  ? import.meta.env.VITE_CODESPACE_NAME.trim()
  : '';

export const API_BASE_URL = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

export function apiUrl(path) {
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export async function apiFetch(path, options) {
  const response = await fetch(apiUrl(path), options);
  if (!response.ok) throw new Error(`API request failed: ${response.status}`);
  return response.json();
}

export function collection(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}