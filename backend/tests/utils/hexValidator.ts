export function expectHexValue(hex: string): void {
  // Regular expression to match a valid hexadecimal string
  const hexRegex = /^(0x)?[0-9a-fA-F]+$/;

  if (!hexRegex.test(hex)) {
    throw new Error(`Expected a valid hexadecimal value, but received: ${hex}`);
  }
}
