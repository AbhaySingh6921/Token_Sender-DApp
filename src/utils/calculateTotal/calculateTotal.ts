 export function calculateTotal(amounts: string): number {
  if (!amounts) return 0;

  // Replace newlines with commas, then split by comma
  const values = amounts.replace(/\n/g, ',').split(',');

  // Parse and sum up valid numbers
  return values.reduce((sum, val) => {
    const num = parseFloat(val.trim());
    return isNaN(num) ? sum : sum + num;
  }, 0);
}
