function generateRandomBlock(length: number = 3): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}

export function generateInviteCode(): string {
  const block1 = generateRandomBlock(3);
  const block2 = generateRandomBlock(3);
  const block3 = generateRandomBlock(3);
  const block4 = generateRandomBlock(3);

  return `${block1}-${block2}-${block3}-${block4}`;
}
