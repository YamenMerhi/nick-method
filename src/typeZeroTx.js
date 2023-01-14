const { Transaction } = require('@ethereumjs/tx');
const { Common } = require('@ethereumjs/common');
const { isValidChecksumAddress, toChecksumAddress, generateAddress, toBuffer } = require('@ethereumjs/util');
const { isValidHex, isValidBytes32, isValidPrivateKey } = require('./utils');

function generateTypeZeroTxJSONFromParams(nonce, gasPrice, gasLimit, value, data, optionalParams) {
	if (
		nonce === undefined ||
		gasPrice === undefined ||
		gasLimit === undefined ||
		value === undefined ||
		data === undefined
	) {
		throw new Error("All parameters except 'optionalParams' are required!");
	}

	if (!(typeof data === 'string' && data.startsWith('0x'))) {
		throw new Error("'data' should be a hex string starting with '0x'");
	}

	if (typeof nonce === 'number') {
		nonce = '0x' + nonce.toString(16);
	} else if (!(typeof nonce === 'string' && nonce.startsWith('0x'))) {
		throw new Error("'nonce' should be a number or a hex string starting with '0x'");
	}

	if (typeof value === 'number') {
		value = '0x' + value.toString(16);
	} else if (!(typeof value === 'string' && value.startsWith('0x'))) {
		throw new Error("'value' should be a number or a hex string starting with '0x'");
	}

	if (typeof gasPrice === 'number') {
		gasPrice = '0x' + gasPrice.toString(16);
	} else if (!(typeof gasPrice === 'string' && gasPrice.startsWith('0x'))) {
		throw new Error("'gasPrice' should be a number or a hex string starting with '0x'");
	}

	if (typeof gasLimit === 'number') {
		gasLimit = '0x' + gasLimit.toString(16);
	} else if (!(typeof gasLimit === 'string' && gasLimit.startsWith('0x'))) {
		throw new Error("'gasLimit' should be a number or a hex string starting with '0x'");
	}

	let { to, v, r, s } = optionalParams || {};

	if (v || r || s) {
		if (!(v && r && s)) {
			throw new Error("'v', 'r', and 's' should all be provided together or none of them should be provided.");
		}
		if (typeof v === 'number') {
			v = '0x' + v.toString(16);
		} else if (typeof v === 'string' && !v.startsWith('0x')) {
			throw new Error("'v' should be a number or a hex string starting with '0x'");
		}
		if (!(typeof r === 'string' && r.startsWith('0x') && r.length === 66)) {
			throw new Error("'r' should be a hex string with a length of 32 bytes (66 characters) starting with '0x'");
		}
		if (!(typeof s === 'string' && s.startsWith('0x') && s.length === 66)) {
			throw new Error("'s' should be a hex string with a length of 32 bytes (66 characters) starting with '0x'");
		}
	}

	const txParams = {
		nonce,
		gasPrice,
		gasLimit,
		value,
		data,
	};

	if (to) {
		if (!(typeof to === 'string' && to.startsWith('0x') && to.length === 42)) {
			throw new Error(
				"'to' should be a valid Ethereum address (hex string starting with '0x' and 42 characters long)",
			);
		}
		txParams.to = to;
	}

	if (v && r && s) {
		txParams.v = v;
		txParams.r = r;
		txParams.s = s;
	}

	// validate if tx is valid according to ethereum-tx repo
	Transaction.fromTxData(txParams);

	return txParams;
}

function generateTypeZeroTxNickMethodConfig(txParams, optionalParameters) {
	if (!txParams) throw new Error('txParams parameter is required');
	if (!txParams.gasLimit || !txParams.gasPrice || !txParams.data)
		throw new Error('txParams must include gasLimit, gasPrice, and data properties');
	if (!optionalParameters) optionalParameters = {};

	let privateKey =
		optionalParameters.privateKey || 'fba50ce0ee4e1153be17ee72af257d6e03db9f2bf09f9aa6271ecfab66908b4f';
	privateKey = privateKey.replace('0x', '');

	// Validate the private key
	if (!isValidPrivateKey(privateKey)) {
		throw new Error('The private key provided is not a valid private key');
	}

	// check and convert gasPrice to hex if number
	if (txParams.gasPrice) {
		if (typeof txParams.gasPrice === 'number') {
			optionalParameters.gasPrice = '0x' + Number(txParams.gasPrice).toString(16);
		} else if (!isValidHex(txParams.gasPrice)) {
			throw new Error('The gasPrice parameter must be a hexadecimal string or a number');
		}
	}

	// check and convert gasLimit to hex if number
	if (txParams.gasLimit) {
		if (typeof txParams.gasLimit === 'number') {
			txParams.gasLimit = '0x' + Number(txParams.gasLimit).toString(16);
		} else if (!isValidHex(txParams.gasLimit)) {
			throw new Error('The gasLimit parameter must be a hexadecimal string or a number');
		}
	}

	// check and convert value to hex if number
	if (txParams.value) {
		if (typeof txParams.value === 'number') {
			txParams.value = '0x' + Number(txParams.value).toString(16);
		} else if (!isValidHex(txParams.value)) {
			throw new Error('The value parameter must be a hexadecimal string or a number');
		}
	}

	if (txParams.r && !isValidBytes32(txParams.r)) {
		throw new Error('The r parameter must be a bytes32 hexadecimal string');
	}

	if (txParams.s && !isValidBytes32(txParams.s)) {
		throw new Error('The s parameter must be a bytes32 hexadecimal string');
	}

	let initialTxParams = {
		nonce: '0x00',
		to: txParams.to || '0x',
		gasPrice: txParams.gasPrice,
		gasLimit: txParams.gasLimit,
		value: txParams.value || '0x00',
		data: txParams.data,
	};

	let tx;

	if (optionalParameters.chainId) {
		const common = Common.custom({ chainId: optionalParameters.chainId });
		tx = Transaction.fromTxData(txParams, { common });
	} else {
		tx = Transaction.fromTxData(txParams);
	}

	let signedTx = tx.sign(Buffer.from(privateKey, 'hex'));

	const newTxParams = {
		nonce: initialTxParams.nonce,
		to: initialTxParams.to,
		gasPrice: initialTxParams.gasPrice,
		gasLimit: initialTxParams.gasLimit,
		value: initialTxParams.value,
		data: initialTxParams.data,
		v: !optionalParameters.chainId ? '0x1b' : '0x' + signedTx.v.toString(16),
		r: optionalParameters.r || '0x1212121212121212121212121212121212121212121212121212121212121212',
		s: optionalParameters.s || '0x' + signedTx.s.toString(16),
	};

	const newTx = Transaction.fromTxData(newTxParams);

	const serializedTxNew = newTx.serialize().toString('hex');

	let addressRecovered = newTx.getSenderAddress().toString('hex');

	if (!isValidChecksumAddress(addressRecovered)) addressRecovered = toChecksumAddress(addressRecovered);

	return {
		rawTx: '0x' + serializedTxNew,
		senderAddress: addressRecovered,
		gasPrice: newTxParams.gasPrice,
		gasLimit: newTxParams.gasLimit,
		r: newTxParams.r,
		s: newTxParams.s,
		v: newTxParams.v,
	};
}

function generateNickMethodConfigForContractDeployment(txParams, optionalParameters) {
	if (!txParams) throw new Error('txParams parameter is required');
	if (!txParams.gasLimit || !txParams.gasPrice || !txParams.data)
		throw new Error('txParams must include gasLimit, gasPrice, and data properties');
	if (!optionalParameters) optionalParameters = {};

	let privateKey =
		optionalParameters.privateKey || 'fba50ce0ee4e1153be17ee72af257d6e03db9f2bf09f9aa6271ecfab66908b4f';
	privateKey = privateKey.replace('0x', '');

	// Validate the private key
	if (!isValidPrivateKey(privateKey)) {
		throw new Error('The private key provided is not a valid private key');
	}

	if (!(typeof data === 'string' && data.startsWith('0x'))) {
		throw new Error("'data' should be a hex string starting with '0x'");
	}

	// check and convert gasPrice to hex if number
	if (txParams.gasPrice) {
		if (typeof txParams.gasPrice === 'number') {
			optionalParameters.gasPrice = '0x' + Number(txParams.gasPrice).toString(16);
		} else if (!isValidHex(txParams.gasPrice)) {
			throw new Error('The gasPrice parameter must be a hexadecimal string or a number');
		}
	}

	// check and convert gasLimit to hex if number
	if (txParams.gasLimit) {
		if (typeof txParams.gasLimit === 'number') {
			txParams.gasLimit = '0x' + Number(txParams.gasLimit).toString(16);
		} else if (!isValidHex(txParams.gasLimit)) {
			throw new Error('The gasLimit parameter must be a hexadecimal string or a number');
		}
	}

	// check and convert value to hex if number
	if (txParams.value) {
		if (typeof txParams.value === 'number') {
			txParams.value = '0x' + Number(txParams.value).toString(16);
		} else if (!isValidHex(txParams.value)) {
			throw new Error('The value parameter must be a hexadecimal string or a number');
		}
	}

	if (txParams.r && !isValidBytes32(txParams.r)) {
		throw new Error('The r parameter must be a bytes32 hexadecimal string');
	}

	if (txParams.s && !isValidBytes32(txParams.s)) {
		throw new Error('The s parameter must be a bytes32 hexadecimal string');
	}

	let initialTxParams = {
		nonce: '0x00',
		gasPrice: txParams.gasPrice,
		gasLimit: txParams.gasLimit,
		value: txParams.value || '0x00',
		data: txParams.data,
	};

	let tx;

	if (optionalParameters.chainId) {
		const common = Common.custom({ chainId: optionalParameters.chainId });
		tx = Transaction.fromTxData(txParams, { common });
	} else {
		tx = Transaction.fromTxData(txParams);
	}

	let signedTx = tx.sign(Buffer.from(privateKey, 'hex'));

	const newTxParams = {
		nonce: initialTxParams.nonce,
		gasPrice: initialTxParams.gasPrice,
		gasLimit: initialTxParams.gasLimit,
		value: initialTxParams.value,
		data: initialTxParams.data,
		v: !optionalParameters.chainId ? '0x1b' : '0x' + signedTx.v.toString(16),
		r: optionalParameters.r || '0x1212121212121212121212121212121212121212121212121212121212121212',
		s: optionalParameters.s || '0x' + signedTx.s.toString(16),
	};

	const newTx = Transaction.fromTxData(newTxParams);

	const serializedTxNew = newTx.serialize().toString('hex');

	let addressRecovered = newTx.getSenderAddress().toString('hex');

	if (!isValidChecksumAddress(addressRecovered)) addressRecovered = toChecksumAddress(addressRecovered);

	const addressBuffer = toBuffer(addressRecovered);
	const nonceBuffer = toBuffer(initialTxParams.nonce);

	let contractAddress = '0x' + generateAddress(addressBuffer, nonceBuffer).toString('hex');
	if (!isValidChecksumAddress(contractAddress)) contractAddress = toChecksumAddress(contractAddress);

	return {
		rawTx: '0x' + serializedTxNew,
		deployerAddress: addressRecovered,
		contractAddress: contractAddress,
		gasPrice: newTxParams.gasPrice,
		gasLimit: newTxParams.gasLimit,
		r: newTxParams.r,
		s: newTxParams.s,
		v: newTxParams.v,
	};
}

function getTypeZeroTxExecutionCost(txParams) {
	const tx = Transaction.fromTxData(txParams);
	return tx.getUpfrontCost().toString();
}

function getTypeZeroTxGasCost(txParams) {
	txParams.value = 0;
	return getTypeZeroTxExecutionCost(txParams);
}

module.exports = {
	generateTypeZeroTxJSONFromParams,
	generateTypeZeroTxNickMethodConfig,
	generateNickMethodConfigForContractDeployment,
	getTypeZeroTxExecutionCost,
	getTypeZeroTxGasCost,
};
