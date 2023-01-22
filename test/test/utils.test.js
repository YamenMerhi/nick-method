const chai = require('chai');

const { expect } = chai;
const { getTxType, recoverSenderFromRawTx, isProtectedTx, isProtectedRawTx } = require('../../src/utils');

const { generateTypeZeroTxJSONFromParams, generateTypeZeroTxNickMethodConfig } = require('../../src/typeZeroTx');

describe('Testing Utils', () => {
	describe('getTxType', () => {
		it('should return 0 for legacy tx', () => {
			const nonce = 0;
			const gasPrice = 283;
			const gasLimit = 283;
			const value = 283;
			const data = '0xaabbccdd';
			const txParams = generateTypeZeroTxJSONFromParams(nonce, gasPrice, gasLimit, value, data);
			const type = getTxType(txParams);
			expect(type).to.equal(0);
		});
	});
	describe('recoverSenderFromRawTx', () => {
		it('should return the correct address', () => {
			const nonce = 0;
			const gasPrice = 283;
			const gasLimit = 283;
			const value = 283;
			const data = '0xaabbccdd';
			const txParams = generateTypeZeroTxJSONFromParams(nonce, gasPrice, gasLimit, value, data, {
				v: '0x1b',
				r: '0x1221122112211221122112211221122112211221122112211221122112211221',
				s: '0x1221122112211221122112211221122112211221122112211221122112211221',
			});
			const { rawTx, senderAddress } = generateTypeZeroTxNickMethodConfig(txParams);
			const recovered = recoverSenderFromRawTx(rawTx);
			expect(recovered).to.equal(senderAddress);
		});

		it('should return a different address when providing random rawTx', () => {
			const nonce = 0;
			const gasPrice = 283;
			const gasLimit = 283;
			const value = 283;
			const data = '0xaabbccdd';
			const txParams = generateTypeZeroTxJSONFromParams(nonce, gasPrice, gasLimit, value, data, {
				v: '0x1b',
				r: '0x1221122112211221122112211221122112211221122112211221122112211221',
				s: '0x1221122112211221122112211221122112211221122112211221122112211221',
			});
			const { senderAddress } = generateTypeZeroTxNickMethodConfig(txParams);
			const OtherRawtx =
				'0xf8528082011b82011b8082011b83aabbcc1ba01212121212121212121212121212121212121212121212121212121212121212a0266b0acb5ed7694215f89efd07e0940858456cacf400cc5c9d07987e75810223';
			const recovered = recoverSenderFromRawTx(OtherRawtx);
			expect(recovered).to.not.equal(senderAddress);
		});
	});

	describe('isProtectedTx', () => {
		it('should return false when v is 27', () => {
			const nonce = 0;
			const gasPrice = 283;
			const gasLimit = 283;
			const value = 283;
			const data = '0xaabbccdd';
			const txParams = generateTypeZeroTxJSONFromParams(nonce, gasPrice, gasLimit, value, data, {
				v: '0x1b',
				r: '0x1221122112211221122112211221122112211221122112211221122112211221',
				s: '0x1221122112211221122112211221122112211221122112211221122112211221',
			});
			const isProtected = isProtectedTx(txParams);
			expect(isProtected).to.equal(false);
		});
		it('should return false when v is 28', () => {
			const nonce = 0;
			const gasPrice = 283;
			const gasLimit = 283;
			const value = 283;
			const data = '0xaabbccdd';
			const txParams = generateTypeZeroTxJSONFromParams(nonce, gasPrice, gasLimit, value, data, {
				v: 28,
				r: '0x1221122112211221122112211221122112211221122112211221122112211221',
				s: '0x1221122112211221122112211221122112211221122112211221122112211221',
			});
			const isProtected = isProtectedTx(txParams);
			expect(isProtected).to.equal(false);
		});

		it('should return true when v is any number above 37', () => {
			const nonce = 0;
			const gasPrice = 283;
			const gasLimit = 283;
			const value = 283;
			const data = '0xaabbccdd';
			const txParams = generateTypeZeroTxJSONFromParams(nonce, gasPrice, gasLimit, value, data, {
				v: 39,
				r: '0x1221122112211221122112211221122112211221122112211221122112211221',
				s: '0x1221122112211221122112211221122112211221122112211221122112211221',
			});
			const isProtected = isProtectedTx(txParams);
			expect(isProtected).to.equal(true);
		});
	});

	describe('isProtectedRawTx', () => {
		it('should return false when v is 27', () => {
			const nonce = 0;
			const gasPrice = 283;
			const gasLimit = 283;
			const value = 283;
			const data = '0xaabbccdd';
			const txParams = generateTypeZeroTxJSONFromParams(nonce, gasPrice, gasLimit, value, data, {
				v: '0x1b',
				r: '0x1221122112211221122112211221122112211221122112211221122112211221',
				s: '0x1221122112211221122112211221122112211221122112211221122112211221',
			});
			const { rawTx } = generateTypeZeroTxNickMethodConfig(txParams);
			const isProtected = isProtectedRawTx(rawTx);
			expect(isProtected).to.equal(false);
		});
		it('should return false when v is 28', () => {
			const nonce = 0;
			const gasPrice = 283;
			const gasLimit = 283;
			const value = 283;
			const data = '0xaabbccdd';
			const txParams = generateTypeZeroTxJSONFromParams(nonce, gasPrice, gasLimit, value, data, {
				v: 28,
				r: '0x1221122112211221122112211221122112211221122112211221122112211221',
				s: '0x1221122112211221122112211221122112211221122112211221122112211221',
			});
			const { rawTx } = generateTypeZeroTxNickMethodConfig(txParams);
			const isProtected = isProtectedRawTx(rawTx);
			expect(isProtected).to.equal(false);
		});

		it('should return true when v is relative to a chainId', () => {
			const nonce = 0;
			const gasPrice = 283;
			const gasLimit = 283;
			const value = 283;
			const data = '0xaabbccdd';
			const txParams = generateTypeZeroTxJSONFromParams(nonce, gasPrice, gasLimit, value, data);
			const { rawTx } = generateTypeZeroTxNickMethodConfig(txParams, { chainId: 1 });
			const isProtected = isProtectedRawTx(rawTx);
			expect(isProtected).to.equal(true);
		});
	});
});
