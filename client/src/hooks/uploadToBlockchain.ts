import { KeyPair, SymbolFacade } from "symbol-sdk/symbol"
import { PrivateKey } from "symbol-sdk"
import { Network } from "symbol-sdk/nem"
import usePrivateKeyStorage from "../hooks/usePrivateKeyStorage.ts"

export default function useUploadToBlockchain() {
  const [privateKey] = usePrivateKeyStorage()

  function uploadToBlockchain(chunks: string[]) {
    if (!privateKey) return

    const account = new KeyPair(new PrivateKey(privateKey))
    const message = new Uint8Array([
      0x00,
      ...new TextEncoder().encode("test transaction"),
    ])

    const facade = new SymbolFacade(Network.TESTNET.toString())

    const tx = facade.transactionFactory.create({
      type: "transfer_transaction_v1",
      signerPublicKey: account.publicKey,
      deadline: facade.now().addHours(2).timestamp,
      recipientAddress: facade.network.publicKeyToAddress(account.publicKey),
      mosaics: [],
      message,
      fee: 1000000n,
    })
    const signature = facade.signTransaction(account, tx)
    const jsonPayload = facade.transactionFactory.static.attachSignature(
      tx,
      signature,
    )

    console.log({ jsonPayload })

    fetch(
      new URL("/transactions", "https://sym-test-03.opening-line.jp:3001"),
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: jsonPayload,
      },
    ).then((res) => res.json())
  }

  return uploadToBlockchain
}
