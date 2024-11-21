import {
    PrivateKey,
    utils,
} from 'symbol-sdk';
import {
    KeyPair,
    Network,
    SymbolFacade,
    metadataUpdateValue,
} from 'symbol-sdk/symbol'
import { TextEncoder } from 'util';
import dotenv from 'dotenv';

dotenv.config();

const { NODE_URL, PRIVATE_KEY, SCOPED_METADATA_KEY_FOR_DELETE } = process.env;

const network = Network.TESTNET;
const facade = new SymbolFacade(network.name);
const deadline = facade.now().addHours(2).timestamp;

const privateKey = new PrivateKey(PRIVATE_KEY);
const keyPair = new KeyPair(privateKey);
const address = network.publicKeyToAddress(keyPair.publicKey)

const textEncoder = new TextEncoder();

const fetchMetadataUrl = new URL('/metadata', NODE_URL)
fetchMetadataUrl.searchParams.append('sourceAddress', address)
fetchMetadataUrl.searchParams.append('targetAddress', address)
fetchMetadataUrl.searchParams.append('scopedMetadataKey', SCOPED_METADATA_KEY_FOR_DELETE)
const fetchMetadata = await fetch(fetchMetadataUrl).then((res) => res.json())
const oldMetadataValue = fetchMetadata.data[0].metadataEntry.value
console.log('oldMetadataValue', oldMetadataValue)

const accountMetadataTransaction = facade.transactionFactory.createEmbedded({
    type: 'account_metadata_transaction_v1',
    signerPublicKey: keyPair.publicKey,
    targetAddress: address,
    scopedMetadataKey: BigInt(`0x${SCOPED_METADATA_KEY_FOR_DELETE}`),
    valueSizeDelta: -1 * oldMetadataValue.length / 2,
    value: metadataUpdateValue(utils.hexToUint8(oldMetadataValue), textEncoder.encode("")),
});

const innerTransactions = [ accountMetadataTransaction ];
const transactionsHash = SymbolFacade.hashEmbeddedTransactions(innerTransactions)

const transaction = facade.transactionFactory.create({
    type: 'aggregate_complete_transaction_v2',
    signerPublicKey: keyPair.publicKey.toString(),
    fee: 1000000n,
    deadline,
    transactions: innerTransactions,
    transactionsHash
});

const signature = facade.signTransaction(keyPair, transaction);
const jsonPayload = facade.transactionFactory.static.attachSignature(transaction, signature);
const hash = facade.hashTransaction(transaction).toString();

console.log(jsonPayload);
console.log(hash);

const sendRes = await fetch(
    new URL('/transactions', NODE_URL),
    { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: jsonPayload }
)
    .then((res) => res.json());
console.log(sendRes);

await new Promise((resolve) => setTimeout(resolve, 1000));

const statusRes = await fetch(new URL("/transactionStatus/" + hash, NODE_URL))
    .then((res) => res.json());
console.log(statusRes);
