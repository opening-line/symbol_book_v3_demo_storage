import { KeyPair, SymbolFacade, metadataUpdateValue } from "symbol-sdk/symbol"
import { PrivateKey, utils } from "symbol-sdk"
import { Config } from "../utils/config.ts"
import usePrivateKeyStorage from "../hooks/usePrivateKeyStorage.ts"
import { useState } from "react"

type Data = {
  hashList: string[]
  responseList: any[]
}

export default function useUploadToBlockchain() {
  const [privateKey] = usePrivateKeyStorage()
  const [result, setResult] = useState<Data | null>(null)
  const [uploading, setUploading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  async function uploadToBlockchain(chunks: { key: string; chunk: string }[]) {
    if (!privateKey) {
      throw new Error("private key is not set")
    }

    setUploading(true)

    try {
      const account = new KeyPair(new PrivateKey(privateKey))
      const facade = new SymbolFacade(Config.NETWORK)
      const deadline = facade.now().addHours(2).timestamp
      const targetAddress = facade.network.publicKeyToAddress(account.publicKey)
      const signerPublicKey = account.publicKey.toString()

      const hashList = []
      const responseList = []

      for (let i = 0; i < chunks.length; i += 100) {
        const chunkSlice = chunks.slice(i, i + 100)

        const metadataTransactions = chunkSlice.map(({ key, chunk }) => {
          const chunkUint8 = utils.hexToUint8(chunk)
          return facade.transactionFactory.createEmbedded({
            type: "account_metadata_transaction_v1",
            signerPublicKey,
            targetAddress,
            scopedMetadataKey: BigInt(`0x${key}`),
            valueSizeDelta: chunkUint8.length,
            value: metadataUpdateValue(new Uint8Array(), chunkUint8),
          })
        })

        const transactionsHash =
          SymbolFacade.hashEmbeddedTransactions(metadataTransactions)

        const transaction = facade.transactionFactory.create({
          type: "aggregate_complete_transaction_v2",
          signerPublicKey,
          fee: 10000000n,
          deadline,
          transactions: metadataTransactions,
          transactionsHash,
        })

        const signature = facade.signTransaction(account, transaction)
        const jsonPayload = facade.transactionFactory.static.attachSignature(
          transaction,
          signature,
        )
        const hash = facade.hashTransaction(transaction).toString()

        const response = await fetch(new URL("/transactions", Config.NODE_URL), {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: jsonPayload,
        })
          .then((res) => res.json())

        hashList.push(hash)
        responseList.push(response)
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))

      setResult({ hashList, responseList })
    } catch (e: any) {
      setError(e.message)
    } finally {
      setUploading(false)
    }
  }

  return {
    upload: uploadToBlockchain,
    result,
    uploading,
    error,
  }
}
