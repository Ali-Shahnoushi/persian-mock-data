export const FORBIDDEN_REPEATED_NATIONAL_IDS = new Set([
  "0000000000",
  "2222222222",
  "3333333333",
  "4444444444",
  "5555555555",
  "6666666666",
  "7777777777",
  "8888888888",
  "9999999999",
]);

/** Implements the project owner's reference algorithm without stricter rules. */
export function validateNationalId(value: string): boolean {
  if (
    !/^[0-9]{10}$/.test(value) ||
    FORBIDDEN_REPEATED_NATIONAL_IDS.has(value)
  ) {
    return false;
  }

  const digits = [...value].map(Number);
  const weightedSum = digits
    .slice(0, 9)
    .reduce(
      (total, digit, index) => total + digit * (10 - index),
      0,
    );
  const remainder = weightedSum % 11;
  const checkDigit = digits[9];

  return remainder < 2
    ? checkDigit === remainder
    : checkDigit === 11 - remainder;
}
