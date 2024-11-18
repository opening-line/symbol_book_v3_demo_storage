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


export const numberToLittleEndianHexString = (num: number, byteSize = 8) => {
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
