export function sanitizeInput(value: string, maxLength = 500): string {
  return value
    .trim()
    .replace(/<[^>]*>/g, '')   // strip HTML tags
    .replace(/[\r\n]{3,}/g, '\n\n') // collapse excessive newlines
    .slice(0, maxLength)
}
