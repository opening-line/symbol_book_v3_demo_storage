import { KeyPair, SymbolFacade } from "symbol-sdk/symbol"
import { PrivateKey } from "symbol-sdk"
import { Config } from "../utils/config.ts"
import usePrivateKeyStorage from "../hooks/usePrivateKeyStorage.ts"
import { MetadataResponse } from "../types/BlockchainAPI.ts"
import { combineLittleEndianHexNumbers } from "../utils/hexUtils.ts"
import { useEffect, useState } from "react"
import { findFirstUnusedIndex } from "../utils/asyncBinarySearch.ts"

type Data = {
  latestFileIndex: number
  nextFileIndex: number
}

export default function useGetLatestFileIndex() {
  const [privateKey] = usePrivateKeyStorage()
  const [data, setData] = useState<Data | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function getLatestFileIndex() {
      try {
        setLoading(true)

        if (!privateKey) {
          throw new Error("private key is not set")
        }

        const account = new KeyPair(new PrivateKey(privateKey))
        const facade = new SymbolFacade(Config.NETWORK)
        const address = facade.network.publicKeyToAddress(account.publicKey)

        const nextFileIndex = await findFirstUnusedIndex((index: number) => {
          return existsHeaderById(controller.signal, address, index)
        })

        setData({
          latestFileIndex: nextFileIndex - 1,
          nextFileIndex,
        })
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    getLatestFileIndex()

    return () => {
      controller.abort()
    }
  }, [])

  async function existsHeaderById(
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

    return data.length > 0
  }

  return { data, loading, error }
}
