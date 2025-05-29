/**
 * Compares two dates (Date, string, number, or null) for equality in time.
 * Throws if they are not equal.
 */
export function expectDatesToBeEqual(
  a: Date | string | number | null,
  b: Date | string | number | null
) {
  if (a === null && b === null) {
    expect(a).toBe(b);
    return;
  }
  // If one is null and the other is not, fail
  if (a === null || b === null) {
    expect(a).toBe(b); // will fail
    return;
  }
  // Convert both to timestamps
  const aTime = new Date(a).getTime();
  const bTime = new Date(b).getTime();
  expect(aTime).toBe(bTime);
}
