export function isValidWord(input: string): boolean {
  const trimmed = input.trim();
  
  if (trimmed.length === 0) {
    return false;
  }
  
  if (trimmed.length < 2) {
    return false;
  }
  
  const wordPattern = /^[a-zA-Z]+(?:[-'\s][a-zA-Z]+)*$/;
  return wordPattern.test(trimmed);
}

export function getValidationError(input: string): string | null {
  const trimmed = input.trim();
  
  if (trimmed.length === 0) {
    return "Please enter a word to search.";
  }
  
  if (trimmed.length < 2) {
    return "Word must be at least 2 characters.";
  }
  
  if (/\d/.test(trimmed)) {
    return "Words cannot contain numbers.";
  }
  
  if (/[^a-zA-Z\-'\s]/.test(trimmed)) {
    return "Only letters, hyphens, and apostrophes are allowed.";
  }
  
  return null;
}
