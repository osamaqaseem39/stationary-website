/**
 * Format a number as Pakistani Rupee (PKR) currency
 */
export function formatPKR(amount: number | string): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numAmount)) return 'PKR 0';
  
  return `PKR ${numAmount.toFixed(2)}`;
}

/**
 * Format a number as PKR without decimals if it's a whole number
 */
export function formatPKRCompact(amount: number | string): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numAmount)) return 'PKR 0';
  
  if (numAmount % 1 === 0) {
    return `PKR ${numAmount}`;
  }
  return `PKR ${numAmount.toFixed(2)}`;
}

/**
 * Format a number as currency (alias for formatPKR for compatibility)
 */
export function formatCurrency(amount: number | string): string {
  return formatPKR(amount);
}

/**
 * Get currency symbol/prefix
 */
export const CURRENCY_SYMBOL = 'PKR';
export const CURRENCY_PREFIX = 'PKR ';

