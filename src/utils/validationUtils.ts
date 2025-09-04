// Validation utility functions
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePlayerName = (name: string): { isValid: boolean; error?: string } => {
  const trimmed = name.trim();
  
  if (trimmed.length < 2) {
    return { isValid: false, error: 'Le nom doit contenir au moins 2 caractères' };
  }
  
  if (trimmed.length > 20) {
    return { isValid: false, error: 'Le nom ne peut pas dépasser 20 caractères' };
  }
  
  if (!/^[a-zA-ZÀ-ÿ0-9\s-_]+$/.test(trimmed)) {
    return { isValid: false, error: 'Le nom contient des caractères non autorisés' };
  }
  
  return { isValid: true };
};

export const validateCustomChallenge = (text: string): { isValid: boolean; error?: string } => {
  const trimmed = text.trim();
  
  if (trimmed.length < 10) {
    return { isValid: false, error: 'Le défi doit contenir au moins 10 caractères' };
  }
  
  if (trimmed.length > 200) {
    return { isValid: false, error: 'Le défi ne peut pas dépasser 200 caractères' };
  }
  
  return { isValid: true };
};

export const validateSessionCode = (code: string): { isValid: boolean; error?: string } => {
  const trimmed = code.trim().toUpperCase();
  
  if (trimmed.length !== 6) {
    return { isValid: false, error: 'Le code doit contenir exactement 6 caractères' };
  }
  
  if (!/^[A-Z0-9]{6}$/.test(trimmed)) {
    return { isValid: false, error: 'Le code ne peut contenir que des lettres et des chiffres' };
  }
  
  return { isValid: true };
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};