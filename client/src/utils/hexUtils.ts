export const reverseHexStringEndian = (hexString: string) => {
  if (hexString.length % 2 !== 0) {
    throw new Error("Invalid hex string length");
  }

  const reversedChunks = [];
  for (let i = 0; i < hexString.length; i += 2) {
    const chunk = hexString.substring(i, i + 2);
    reversedChunks.unshift(chunk);
  }

  return reversedChunks.join("");
};


export const numberToLittleEndianHexString = (num: number, byteSize = 4) => {
  if (byteSize <= 0) {
    throw new Error("Invalid byte size");
  }

  let hexString = num.toString(16).padStart(byteSize * 2, '0');

  if (hexString.length > byteSize * 2) {
    throw new Error("The number cannot fit in the specified byte size");
  }

  const reversedChunks = [];
  for (let i = 0; i < hexString.length; i += 2) {
    const chunk = hexString.substring(i, i + 2);
    reversedChunks.unshift(chunk);
  }

  return reversedChunks.join("");
};

export function combineHexNumbers(num1: number, num2: number): string {
  if (num1 < 0 || num2 < 0 || num1 >= 0x100000000 || num2 >= 0x100000000) {
    throw new Error("引数の数値が範囲外です。");
  }

  const hex1 = num1.toString(16).padStart(8, '0');
  const hex2 = num2.toString(16).padStart(8, '0');
  return hex1 + hex2;
}

export function combineLittleEndianHexNumbers(num1: number, num2: number): string {
  if (num1 < 0 || num2 < 0 || num1 >= 0x100000000 || num2 >= 0x100000000) {
    throw new Error("引数の数値が範囲外です。");
  }

  const littleEndianHex1 = numberToLittleEndianHexString(num1, 4);
  const littleEndianHex2 = numberToLittleEndianHexString(num2, 4);

  return littleEndianHex1 + littleEndianHex2;
}
