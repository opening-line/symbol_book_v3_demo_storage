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
  propertyChunksLength: number,
  imageChunksLength: number,
) {
  const version = "00000000"
  const reserve = "00000000"
  const length = numberToLittleEndianHexString(
    1 + propertyChunksLength + imageChunksLength,
  )
  const propertyOffset = "01000000"
  const payloadOffset = numberToLittleEndianHexString(
    propertyChunksLength + 1,
  )
  return [version, reserve, length, propertyOffset, payloadOffset].join("")
}

function createProperty(fileName: string, timestamp: number) {
  const propertyObject = {
    fileName,
    timestamp,
  }

  const encoder = new TextEncoder()
  const propertyJsonString = JSON.stringify(propertyObject)
  const propertyBytes = encoder.encode(propertyJsonString)
  return Array.from(propertyBytes)
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
  const propertyHex = createProperty(file.name, timestamp)

  const imageChunks = splitChunks(imageHex)
  const propertyChunks = splitChunks(propertyHex)

  const header = createHeader(propertyChunks.length, imageChunks.length)

  return [header, ...propertyChunks, ...imageChunks].map(
    (chunk, index) => {
      return {
        key: numbersToLittleEndianHexNumbers(fileIndex, index),
        chunk,
      }
    },
  )
}

export default create
