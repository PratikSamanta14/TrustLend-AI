import axios from 'axios';
const api = axios.create({ baseURL: '/api' });

export async function analyzeDocument(file, onProgress) {
  const form = new FormData();
  form.append('file', file);
  const { data } = await api.post('/analyze', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: p => onProgress && onProgress(Math.round((p.loaded * 100) / p.total)),
  });
  return data;
}

export async function compareDocuments(file1, file2) {
  const form = new FormData();
  form.append('file_a', file1);
  form.append('file_b', file2);
  const { data } = await api.post('/compare', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}
