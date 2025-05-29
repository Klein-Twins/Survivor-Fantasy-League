import { Color } from '../../src/generated-api';

export function expectColor(color: Color) {
  expect(color).toHaveProperty('name');
  expect(typeof color.name).toBe('string');
  expect(color.name.length).toBeGreaterThan(0);

  expect(color).toHaveProperty('hex');
  expect(typeof color.hex).toBe('string');
  expect(color.hex.length).toBe(7); // Hex color codes are typically 7 characters long (#RRGGBB)
  expect(color.hex[0]).toBe('#'); // Ensure it starts with '#'

  // Optionally, you can add more checks for valid hex format
  const hexRegex = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/;
  expect(hexRegex.test(color.hex)).toBe(true);
}
