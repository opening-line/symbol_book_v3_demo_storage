import { KeyPair, SymbolFacade } from "symbol-sdk/symbol"
import { PrivateKey, utils } from "symbol-sdk"
import { Config } from "../utils/config.ts"
import usePrivateKeyStorage from "../hooks/usePrivateKeyStorage.ts"
import { DataItem, Header, MetadataResponse } from "../types/BlockchainAPI.ts"
import { combineLittleEndianHexNumbers } from "../utils/hexUtils.ts"
import { useEffect, useState } from "react"
import mime from "mime"

type Data = {
  meta: any
  mime: string | null
  payload: string
}

const parseHeader = (value: string): Header => {
  const byteArray = utils.hexToUint8(value)
  const dataView = new DataView(byteArray.buffer)

  return {
    version: dataView.getUint32(0, true),
    reserve: dataView.getUint32(4, true),
    length: dataView.getUint32(8, true),
    metadataOffset: dataView.getUint32(12, true),
    payloadOffset: dataView.getUint32(16, true),
  }
}

export default function useGetImageFromBlockchain(fileId?: string) {
  const [privateKey] = usePrivateKeyStorage()
  const [data, setData] = useState<Data | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function getImageFromBlockchain() {
      try {
        setLoading(true)

        if (!privateKey) {
          throw new Error("private key is not set")
        }

        if (!fileId) {
          throw new Error("file id is not set")
        }

        const fileIdNumber = Number(fileId)

        if (isNaN(fileIdNumber)) {
          throw new Error("Invalid file ID")
        }

        const account = new KeyPair(new PrivateKey(privateKey))
        const facade = new SymbolFacade(Config.NETWORK)
        const address = facade.network.publicKeyToAddress(account.publicKey)

        const header = await getHeader(controller.signal, address, fileIdNumber)

        const body = await getBody(
          controller.signal,
          address,
          fileIdNumber,
          header,
        )

        const [meta, ...chunks] = body

        const decoder = new TextDecoder("utf-8")
        const fileMeta = JSON.parse(
          decoder.decode(utils.hexToUint8(meta.value)),
        )

        const fileMime = fileMeta.fileName
          ? mime.getType(fileMeta.fileName)
          : null

        const payload = chunks
          .map((payload) => payload.value)
          .reduce((accumulator, currentValue) => accumulator + currentValue, "")

        const base64Payload = btoa(
          String.fromCharCode(...utils.hexToUint8(payload)),
        )

        setData({
          meta: fileMeta,
          mime: fileMime,
          payload: base64Payload,
        })
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    getImageFromBlockchain()

    return () => {
      controller.abort()
    }
  }, [fileId])

  async function getHeader(
    signal: AbortSignal,
    address: string,
    fileId: number,
  ) {
    const url = new URL("/metadata", Config.NODE_URL)
    url.searchParams.append("sourceAddress", address)
    url.searchParams.append("targetAddress", address)
    url.searchParams.append("metadataType", "0")
    url.searchParams.append(
      "scopedMetadataKey",
      combineLittleEndianHexNumbers(fileId, 0),
    )
    const { data } = (await fetch(url, { signal }).then((res) =>
      res.json(),
    )) as MetadataResponse
    const headerData = data.map(({ metadataEntry }) => {
      return {
        value: metadataEntry.value,
      }
    })[0]
    if (!headerData) {
      throw new Error("no metadata found")
    }
    return parseHeader(headerData.value)
  }

  async function getBody(
    signal: AbortSignal,
    address: string,
    fileId: number,
    header: Header,
  ) {
    const results: DataItem[] = []
    for (let i = 1; i < header.length; i++) {
      const url = new URL("/metadata", Config.NODE_URL)
      url.searchParams.append("sourceAddress", address)
      url.searchParams.append("targetAddress", address)
      url.searchParams.append("metadataType", "0")
      url.searchParams.append(
        "scopedMetadataKey",
        `${combineLittleEndianHexNumbers(fileId, i)}`,
      )
      const { data } = (await fetch(url, { signal }).then((res) =>
        res.json(),
      )) as MetadataResponse
      const bodyData: DataItem[] = data.map(({ metadataEntry }) => {
        return {
          fileIndex: metadataEntry.scopedMetadataKey.substring(0, 8),
          valueIndex: metadataEntry.scopedMetadataKey.substring(8),
          value: metadataEntry.value,
        }
      })
      if (!bodyData) {
        throw new Error("no metadata found")
      }
      results.push(bodyData[0])
    }
    return results
  }

  return { data, loading, error }
}
