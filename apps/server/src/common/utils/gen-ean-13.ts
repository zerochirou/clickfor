export function generateEAN13CheckDigit(base12Digits: string): string {
  if (!/^\d{12}$/.test(base12Digits)) {
    throw new Error('EAN-13 membutuhkan tepat 12 digit angka.');
  }

  let oddSum = 0;
  let evenSum = 0;

  for (let i = 0; i < 12; i++) {
    const digit = parseInt(base12Digits[i], 10);

    if (i % 2 === 0) {
      oddSum += digit;
    } else {
      evenSum += digit;
    }
  }

  const total = oddSum + evenSum * 3;
  const remainder = total % 10;
  const checkDigit = remainder === 0 ? 0 : 10 - remainder;
  return base12Digits + checkDigit;
}
