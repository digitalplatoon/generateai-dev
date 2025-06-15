
export class ContentSanitizer {
  static sanitize(content: string): string {
    return content
      // Remove excessive whitespace
      .replace(/\s{3,}/g, ' ')
      // Remove excessive punctuation
      .replace(/[!?]{3,}/g, '!!')
      // Remove control characters
      .replace(/[\x00-\x1F\x7F]/g, '')
      // Trim
      .trim();
  }
}
