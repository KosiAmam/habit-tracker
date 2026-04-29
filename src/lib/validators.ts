type ValidationResult = { valid: boolean; value: string; error: string | null };

export function validateHabitName(name: string): ValidationResult {
  const value = name.trim();
  if (!value) return { valid: false, value, error: 'Habit name is required' };
  if (value.length > 60)
    return {
      valid: false,
      value,
      error: 'Habit name must be 60 characters or fewer',
    };
  return { valid: true, value, error: null };
}

export function validateEmail(email: string): ValidationResult {
  const value = email.trim().toLowerCase();
  if (!value) return { valid: false, value, error: 'Email is required' };
  // RFC-compliant enough for UX purposes
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!pattern.test(value))
    return { valid: false, value, error: 'Enter a valid email address' };
  return { valid: true, value, error: null };
}

export function validatePassword(password: string): ValidationResult {
  const value = password; // don't trim passwords
  if (!value) return { valid: false, value, error: 'Password is required' };
  if (value.length < 8)
    return {
      valid: false,
      value,
      error: 'Password must be at least 8 characters',
    };
  if (!/[A-Z]/.test(value))
    return {
      valid: false,
      value,
      error: 'Password must contain at least one uppercase letter',
    };
  if (!/[0-9]/.test(value))
    return {
      valid: false,
      value,
      error: 'Password must contain at least one number',
    };
  return { valid: true, value, error: null };
}
