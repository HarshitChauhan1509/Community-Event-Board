/**
 * Formats a number into Indian Rupee currency format (e.g., ₹1,50,000, ₹499, ₹1,299).
 */
export function formatIndianPrice(amount: number): string {
  if (amount === 0) return 'Free';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats an event date and time into a friendly format (e.g., "Sat, 18 Oct, 6:30 PM").
 */
export function formatEventDate(dateInput: Date | string, timeStr?: string): string {
  const d = new Date(dateInput);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  };
  const formattedDate = new Intl.DateTimeFormat('en-IN', options).format(d);

  if (timeStr) {
    return `${formattedDate}, ${timeStr}`;
  }
  return formattedDate;
}
