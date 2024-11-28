import {combineLittleEndianHexNumbers, numberToLittleEndianHexString} from "./hexUtils.ts";

const splitChunks = (hex: string, chunkSize = 2048) => {
  const chunks = []
  for (let i = 0; i < hex.length; i += chunkSize) {
    chunks.push(hex.substring(i, i + chunkSize))
  }
  return chunks
}

function create(file: File, imageHex: string, fileIndex: number): Array<{
  key: string,
  chunk: string
}> {
  const metadataObject = {
    fileName: file.name,
    timestamp: Date.now(),
  }

  const encoder = new TextEncoder()
  const metadataHex = Array.from(
    encoder.encode(JSON.stringify(metadataObject)),
  )
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")

  const imageChunks = splitChunks(imageHex)
  const metadataChunks = splitChunks(metadataHex)
  const headerVersion = "00000000"
  const headerReserve = "00000000"
  const headerLength = numberToLittleEndianHexString(
    1 + metadataChunks.length + imageChunks.length,
  )
  const headerMetadataOffset = "01000000"
  const headerPayloadOffset = numberToLittleEndianHexString(
    metadataChunks.length + 1,
  )
  const header = `${headerVersion}${headerReserve}${headerLength}${headerMetadataOffset}${headerPayloadOffset}`
  return [header, ...metadataChunks, ...imageChunks].map(
    (chunk, index) => {
      return {
        key: combineLittleEndianHexNumbers(fileIndex, index),
        chunk,
      }
    },
  )
}

export default create
