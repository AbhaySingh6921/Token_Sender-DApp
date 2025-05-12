// src/utils/calculateTotal/calculateTotal.test.ts
import { calculateTotal } from './calculateTotal';

describe('calculateTotal', () => {
  test('sums newline-separated numbers', () => {
    expect(calculateTotal('100\n200\n300')).toBe(600);
  });

  test('sums comma-separated numbers', () => {
    expect(calculateTotal('100,200,300')).toBe(600);
  });

  test('sums mixed newlines and commas', () => {
    expect(calculateTotal('100,200\n300')).toBe(600);
  });

  test('ignores non-numeric strings', () => {
    expect(calculateTotal('100,abc\n200')).toBe(300);
  });

  test('returns 0 for empty string', () => {
    expect(calculateTotal('')).toBe(0);
  });
});
