# nick-method

A package that offers various options for creating transactions in accordance with the nick method, as well as utility functions for recovering transactions and sender addresses from raw transactions.

To learn more about Nick's method, read this article: [Nick's method - Ethereum Keyless Execution](https://medium.com/@yamenmerhi/nicks-method-ethereum-keyless-execution-168a6659479c)

_Note: Currently, only legacy transactions (type 0) are supported. Type 1 and 2 will be added soon._

_This package is in testing phase, please test on testnets before applying in production._

## Usage

npm

```shell script
$ npm install nick-method
```

### API

```js
const nickMethod = require("nick-method");

// Generate txParams

let nonce;
let gasPrice;
let gasLimit;
let value;
let data;
let to;
let v;
let r;
let s;

const txParams = nickMethod.generateTypeZeroTxJSONFromParams(
  nonce,
  gasPrice,
  gasLimit,
  value,
  data
);
```

```js
// Generate nick method config to deploy a contract from
// a random address on different chains

let txParams = {
  nonce: 0,
  value: 0,
  gasPrice: 1000000000000,
  gasLimit: 1000000,
  data: "// bytecode + constructor param",
};

const config = generateNickMethodConfigForContractDeployment(txParams);

> {
  rawTx: '0xf9047c8085e8d4a51000830f42408080b90429.............',
  deployerAddress: '0x62d517a7451007232d2f1DDE6385882DdC293F26',
  contractAddress: '0xE8cE8c9d71f98893B39286D382eEA3B94010A020',
  gasPrice: '0xe8d4a51000',
  gasLimit: '0xf4240',
  r: '0x1212121212121212121212121212121212121212121212121212121212121212',
  s: '0x1811fb2e72af1eee2210a2bab6f93da5490cbfe935568afd461f9bf5e2c76151',
  v: '0x1b'
}
```

1. Fund the deployerAddress with the necessary cost (value + gasPrice \* gasLimit), can be calculated with getTypeZeroTxExecutionCost(txParams)

2. Connect to networks nodes that allow unprotected tx.

```js
const Web3 = require("web3");
// const web3 = new Web3('https://celo-alfajores.infura.io/v3/{API}');
// const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545/');
// const web3 = new Web3('https://rpc.l14.lukso.network');
```

3. Execute the script below

```js
const Web3 = require("web3");
// const web3 = new Web3('https://celo-alfajores.infura.io/v3/{API}');
// const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545/');
// const web3 = new Web3('https://rpc.l14.lukso.network');

const rawTx = "0xf9047c8085e8d4a51000830f42408080b90429....";

async function sendRawTx() {
  await web3.eth.sendSignedTransaction(rawTx).on("receipt", console.log);
}

sendRawTx();
```

4. The contract deployed will be created on ${contractAddress}.
