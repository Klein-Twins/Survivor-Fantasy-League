export function expectEnumValue<T extends object>(
  enumObj: T,
  value: unknown,
  errorMessage?: string
): asserts value is T[keyof T] {
  const isValid = Object.values(enumObj).includes(value as T[keyof T]);
  if (!isValid) {
    throw new Error(
      errorMessage ||
        `Value "${value}" is not a valid member of enum: [${Object.values(
          enumObj
        ).join(', ')}]`
    );
  }
  expect(isValid).toBe(true);
}
