type Seo = { title: string; description: string; keywords: string[] };
export const experimentsSeo: Record<string, Seo> = new Proxy({}, { get: (_t, k) => ({ title: String(k), description: 'stub', keywords: [] }) });
