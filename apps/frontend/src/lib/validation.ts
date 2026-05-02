export interface ValidationResult {
  valid: boolean;
  confidence: number;
  type: 'modern' | 'legacy';
  errors?: string[];
}

const EPIC_REGEX = /^[A-Z]{3}[0-9]{7}$/;

function luhnChecksum(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, '');
  let sum = 0;
  let isEven = false;
  
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}

export function validateEPIC(epic: string): ValidationResult {
  if (!epic || typeof epic !== 'string') {
    return { valid: false, confidence: 0, type: 'legacy', errors: ['EPIC number is required'] };
  }
  
  const normalized = epic.toUpperCase().trim();
  
  if (!EPIC_REGEX.test(normalized)) {
    return { 
      valid: false, 
      confidence: 0.3, 
      type: 'legacy',
      errors: ['EPIC must be 3 letters followed by 7 digits']
    };
  }
  
  const hasValidLuhn = luhnChecksum(normalized);
  
  if (hasValidLuhn) {
    return { valid: true, confidence: 0.95, type: 'modern' };
  }
  
  return { valid: true, confidence: 0.6, type: 'legacy' };
}