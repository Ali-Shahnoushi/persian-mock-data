export function validatePersianName(value: string): boolean {
  return (
    value.length > 0 &&
    value.length <= 100 &&
    value === value.trim() &&
    !/[\u200b-\u200f\u202a-\u202e\u2060-\u206f]/u.test(value) &&
    /^[\u0600-\u06ff]+(?: [\u0600-\u06ff]+)*$/u.test(value)
  );
}
