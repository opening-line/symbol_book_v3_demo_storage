import {
  numbersToLittleEndianHexNumbers,
  numberToLittleEndianHexString,
} from "./hexUtils.ts"

const splitChunks = (hex: string, chunkSize = 2048) => {
  const chunks = []
  for (let i = 0; i < hex.length; i += chunkSize) {
    chunks.push(hex.substring(i, i + chunkSize))
  }
  return chunks
}

function createHeader(
  metadataChunksLength: number,
  imageChunksLength: number,
) {
  const version = "00000000"
  const reserve = "00000000"
  const length = numberToLittleEndianHexString(
    1 + metadataChunksLength + imageChunksLength,
  )
  const metadataOffset = "01000000"
  const payloadOffset = numberToLittleEndianHexString(
    metadataChunksLength + 1,
  )
  return [version, reserve, length, metadataOffset, payloadOffset].join("")
}

function createMetadata(fileName: string, timestamp: number) {
  const metadataObject = {
    fileName,
    timestamp,
  }

  const encoder = new TextEncoder()
  return Array.from(encoder.encode(JSON.stringify(metadataObject)))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
}

function create(
  file: File,
  imageHex: string,
  fileIndex: number,
  timestamp: number,
): Array<{
  key: string
  chunk: string
}> {
  const metadataHex = createMetadata(file.name, timestamp)

  const imageChunks = splitChunks(imageHex)
  const metadataChunks = splitChunks(metadataHex)

  const header = createHeader(metadataChunks.length, imageChunks.length)

  return [header, ...metadataChunks, ...imageChunks].map(
    (chunk, index) => {
      return {
        key: numbersToLittleEndianHexNumbers(fileIndex, index),
        chunk,
      }
    },
  )
}

export default create
