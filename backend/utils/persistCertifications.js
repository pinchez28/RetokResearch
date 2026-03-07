export const persistCertifications = (input) => {
  if (!input) return [];

  if (Array.isArray(input)) {
    return input.map((c) => c.trim()).filter(Boolean);
  }

  if (typeof input === 'string') {
    // Try to parse JSON array
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed))
        return parsed.map((c) => c.trim()).filter(Boolean);
    } catch {
      // fallback: comma-separated string
      return input
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);
    }
  }

  return [];
};
