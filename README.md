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

const txParams = nickMethod.generateTypeZeroTxJSONFromParams(nonce, gasPrice, gasLimit, value, data, optionalParameters);

const transactionConfig = nickMethod.generateTypeZeroTxNickMethodConfig(txParams);

const deploymentConfig = nickMethod.generateNickMethodConfigForContractDeployment(txParams);

const executionCost = nickMethod.getTypeZeroTxExecutionCost(txParams);

const gasCost = nickMethod.getTypeZeroTxGasCost(txParams);


// Utilities:

isProtectedTx(..)
isProtectedRawTx(..)
recoverSenderFromRawTx(..)
getTxType(..)

```

#### Soon
```
Detailed documentation about how to use each function will be available soon under ./docs.
```


### Multi-chain deployment on the same address

#### Generate txParams

```js
const nickMethod = require("nick-method");

let txParams = {
  nonce: 0,  // nonce should be 0
  value: 0,
  gasPrice: 1000000000000, // gasPrice should be taken into consideration for future 
  gasLimit: 1000000, // gasLimit for the deployment
  data: "0xab11ffcc.......", // bytecode + constructor argument encoded if present
};
```

#### Generate config

```js
const config = nickMethod.generateNickMethodConfigForContractDeployment(txParams);

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

#### Funding deployer Address

Fund the **deployerAddress** with the necessary cost `value + gasPrice * gasLimit`,can be calculated with `getTypeZeroTxExecutionCost(txParams)`.



#### Broadcasting the rawTx to the network

Connect to networks nodes that allow unprotected tx.

```js
const Web3 = require("web3");

// These networks support Unprotected tx such as alfajores-celo, l14-LUKSO, binance testnet.

// const web3 = new Web3('https://celo-alfajores.infura.io/v3/{API}');
// const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545/');
// const web3 = new Web3('https://rpc.l14.lukso.network');
```

Execute the script below with uncommenting the intended network to deploy on:

```js
const Web3 = require("web3");
// const web3 = new Web3('https://celo-alfajores.infura.io/v3/{API}');
// const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545/');
// const web3 = new Web3('https://rpc.l14.lukso.network');

const rawTx = "0xf9047c8085e8d4a51000830f42408080b90429...."; // Paste the full rawTx here

async function sendRawTx() {
  await web3.eth.sendSignedTransaction(rawTx).on("receipt", console.log);
}

sendRawTx();
```

#### Contract deployed

The contract deployed will be created on the **contractAddress** pointed by the config generated from `generateNickMethodConfigForContractDeployment(..)` function. The script above can be executed on several networks and the resultant contract address will be the same as long as the deployer address is funded.


