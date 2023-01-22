const { utils } = require('ethereum-cryptography/secp256k1');
const { Transaction } = require('@ethereumjs/tx');
const {
  isValidChecksumAddress,
  toChecksumAddress,
} = require('@ethereumjs/util');

function getTxType(txParams) {
  const tx = Transaction.fromTxData(txParams);
  return tx.type;
}

function recoverSenderFromRawTx(rawTx) {
  const serializedTxBuffer = Buffer.from(rawTx.substring(2), 'hex');
  const tx = Transaction.fromSerializedTx(serializedTxBuffer);
  let sender = tx.getSenderAddress().toString();
  if (!isValidChecksumAddress(sender)) sender = toChecksumAddress(sender);
  return sender;
}

function isProtectedTx(txParams) {
  const tx = Transaction.fromTxData(txParams);
  return tx.supports(155);
}

function isProtectedRawTx(rawTx) {
  const serializedTxBuffer = Buffer.from(rawTx.substring(2), 'hex');
  const tx = Transaction.fromSerializedTx(serializedTxBuffer);
  return tx.supports(155);
}

function isValidHex(string) {
  const hexRegex = /^0x[0-9a-f]+$/i;
  return hexRegex.test(string);
}

function isValidBytes32(string) {
  const bytes32Regex = /^0x[0-9a-f]{64}$/i;
  return bytes32Regex.test(string);
}

function isValidPrivateKey(privateKey) {
  return utils.isValidPrivateKey(privateKey);
}

module.exports = {
  isProtectedTx,
  isProtectedRawTx,
  recoverSenderFromRawTx,
  getTxType,
  isValidBytes32,
  isValidPrivateKey,
  isValidHex,
};
