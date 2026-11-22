/**
 * Checks the package's documented format-level policy: 10 ASCII digits with
 * no 0 or 2 in the first five positions. It does not prove allocation or
 * deliverability.
 */
export function validatePostalCode(value: string): boolean {
  return /^[13456789]{5}[0-9]{5}$/.test(value);
}
