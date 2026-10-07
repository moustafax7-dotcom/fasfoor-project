export function buildItemPayload({ imageFile, ...data }) {
  if (!imageFile) return data;
  const payload = new FormData();
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue;
    payload.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
  }
  payload.append('image', imageFile);
  return payload;
}
