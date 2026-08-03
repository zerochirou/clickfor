export interface ProductAttributes {
  category: string;
}

export interface SkuOptions {
  separator?: string;
  randomSuffixLength?: number;
  prefix?: string;
}

export function generateSKU(
  product: ProductAttributes,
  options: SkuOptions = {},
): string {
  const { separator = '-', randomSuffixLength = 4, prefix = '' } = options;

  const sanitize = (str: string): string =>
    str
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .trim();

  const parts: string[] = [];

  if (prefix) {
    parts.push(sanitize(prefix));
  }

  if (product.category) parts.push(sanitize(product.category));

  const generateRandomSuffix = (length: number): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  if (randomSuffixLength > 0) {
    parts.push(generateRandomSuffix(randomSuffixLength));
  }

  return parts.join(separator);
}
