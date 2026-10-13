function parseKeys(raw = ''): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const entry of raw.split(';')) {
    const [key, scopes = ''] = entry.split(':');
    if (key && key.trim()) {
      out[key.trim()] = scopes.split('+').map((s) => s.trim()).filter(Boolean);
    }
  }
  return out;
}

export default () => ({
  app: {
    name: 'vibrix-api',
    env: process.env.NODE_ENV ?? 'development',
    port: parseInt(process.env.PORT ?? '3000', 10),
  },
  auth: { apiKeys: parseKeys(process.env.API_KEYS) },
});
