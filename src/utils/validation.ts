const SINGLE_WORD_PATTERN = /^[a-zA-Z]+(?:[-'][a-zA-Z]+)*$/;

export function isValidWord(input: string): boolean {
  const trimmed = input.trim();

  if (trimmed.length === 0) {
    return false;
  }

  if (trimmed.length < 2) {
    return false;
  }

  if (/\s/.test(trimmed)) {
    return false;
  }

  return SINGLE_WORD_PATTERN.test(trimmed);
}

export function getValidationError(input: string): string | null {
  const trimmed = input.trim();

  if (trimmed.length === 0) {
    return "Please enter a word to search.";
  }

  if (trimmed.length < 2) {
    return "Word must be at least 2 characters.";
  }

  if (/\s/.test(trimmed)) {
    return "Please enter a single word (no spaces).";
  }

  if (/\d/.test(trimmed)) {
    return "Words cannot contain numbers.";
  }

  if (/[^a-zA-Z\-']/.test(trimmed)) {
    return "Only letters, hyphens, and apostrophes are allowed.";
  }

  return null;
}

export function extractFirstWord(input: string): string | null {
  const trimmed = input.trim();
  const firstWord = trimmed.split(/\s+/)[0]?.toLowerCase();

  if (!firstWord || firstWord.length < 2) {
    return null;
  }

  if (!SINGLE_WORD_PATTERN.test(firstWord)) {
    return null;
  }

  return firstWord;
}
