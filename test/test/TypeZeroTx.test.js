const chai = require('chai');

const { expect } = chai;
const {
 generateTypeZeroTxJSONFromParams,
 generateNickMethodConfigForContractDeployment,
 generateTypeZeroTxNickMethodConfig,
 getTypeZeroTxExecutionCost,
 getTypeZeroTxGasCost,
} = require('../../src/typeZeroTx');

describe('Testing TypeZeroTx', () => {
 describe('generateTypeZeroTxJSONFromParams', () => {
  describe('When not providing all the needeed parameters ', () => {
   it('should revert when giving only nonce ', () => {
    expect(() => {
     generateTypeZeroTxJSONFromParams(0);
    }).to.throw("All parameters except 'optionalParams' are required!");
   });

   it('should revert when giving nonce, gasPrice ', () => {
    expect(() => {
     generateTypeZeroTxJSONFromParams(0, 100000000000);
    }).to.throw("All parameters except 'optionalParams' are required!");
   });

   it('should revert when giving nonce, gasPrice, gasLimit ', () => {
    expect(() => {
     generateTypeZeroTxJSONFromParams(0, 100000000000, 100000);
    }).to.throw("All parameters except 'optionalParams' are required!");
   });

   it('should revert when giving nonce, gasPrice, gasLimit, value ', () => {
    expect(() => {
     generateTypeZeroTxJSONFromParams(0, 100000000000, 100000, 0);
    }).to.throw("All parameters except 'optionalParams' are required!");
   });
  });

  describe('when providing all the needed parameters', () => {
   describe('when providing the parameters in a wrong format', () => {
    it('should throw when giving nonce as a string', () => {
     const nonce = 'Test';
     const gasPrice = 100000000000;
     const gasLimit = 100000;
     const value = 0;
     const data = '0xaabbccdd';

     expect(() => {
      generateTypeZeroTxJSONFromParams(nonce, gasPrice, gasLimit, value, data);
     }).to.throw(
      "'nonce' should be a number or a hex string starting with '0x'"
     );
    });
    it('should throw when giving value as a string', () => {
     const nonce = 0;
     const gasPrice = 100000000000;
     const gasLimit = 100000;
     const value = 'Bye';
     const data = '0xaabbccdd';

     expect(() => {
      generateTypeZeroTxJSONFromParams(nonce, gasPrice, gasLimit, value, data);
     }).to.throw(
      "'value' should be a number or a hex string starting with '0x'"
     );
    });

    it('should throw when giving gasPrice as a bool', () => {
     const nonce = 0;
     const gasPrice = true;
     const gasLimit = 100000;
     const value = 0;
     const data = '0xaabbccdd';

     expect(() => {
      generateTypeZeroTxJSONFromParams(nonce, gasPrice, gasLimit, value, data);
     }).to.throw(
      "'gasPrice' should be a number or a hex string starting with '0x'"
     );
    });
    it('should throw when giving gasLimit as an array', () => {
     const nonce = 0;
     const gasPrice = 100;
     const gasLimit = [];
     const value = 0;
     const data = '0xaabbccdd';

     expect(() => {
      generateTypeZeroTxJSONFromParams(nonce, gasPrice, gasLimit, value, data);
     }).to.throw(
      "'gasLimit' should be a number or a hex string starting with '0x'"
     );
    });
   });
   describe('when providing the parameters in a correct format', () => {
    it('should pass when giving nonce, gasPrice, gasLimit, value and data and expect to have all properties given and convert them to hex', () => {
     const nonce = 0;
     const gasPrice = 100000000000;
     const gasLimit = 100000;
     const value = 0;
     const data = '0xaabbccdd';

     const txParams = generateTypeZeroTxJSONFromParams(
      nonce,
      gasPrice,
      gasLimit,
      value,
      data
     );
     expect(txParams).to.have.property('nonce', `0x${nonce.toString(16)}`);
     expect(txParams).to.have.property(
      'gasPrice',
      `0x${gasPrice.toString(16)}`
     );
     expect(txParams).to.have.property(
      'gasLimit',
      `0x${gasLimit.toString(16)}`
     );
     expect(txParams).to.have.property('value', `0x${value.toString(16)}`);
     expect(txParams).to.have.property('data', data);
    });

    it('should pass when giving nonce, gasPrice, gasLimit, value and data and expect to have all properties with the value given in hex', () => {
     const nonce = '0x0';
     const gasPrice = '0x10000000';
     const gasLimit = '0x100000';
     const value = '0x0';
     const data = '0xaabbccdd';

     const txParams = generateTypeZeroTxJSONFromParams(
      nonce,
      gasPrice,
      gasLimit,
      value,
      data
     );
     expect(txParams).to.have.property('nonce', nonce);
     expect(txParams).to.have.property('gasPrice', gasPrice);
     expect(txParams).to.have.property('gasLimit', gasLimit);
     expect(txParams).to.have.property('value', value);
     expect(txParams).to.have.property('data', data);
    });

    it('should pass when giving parameters in hex and in numbers and should return the hex representation', () => {
     const nonce = '0x0';
     const gasPrice = 2770000;
     const gasLimit = '0x100000';
     const value = 1000;
     const data = '0xaabbccdd';

     const txParams = generateTypeZeroTxJSONFromParams(
      nonce,
      gasPrice,
      gasLimit,
      value,
      data
     );
     expect(txParams).to.have.property('nonce', nonce);
     expect(txParams).to.have.property(
      'gasPrice',
      `0x${gasPrice.toString(16)}`
     );
     expect(txParams).to.have.property('gasLimit', gasLimit);
     expect(txParams).to.have.property('value', `0x${value.toString(16)}`);
     expect(txParams).to.have.property('data', data);
    });
   });
  });

  describe('when providing optional parameters', () => {
   describe('when providing the parameters in a wrong format', () => {
    it('should throw when giving to field as a bytes4 string', () => {
     const nonce = '0x0';
     const gasPrice = 2770000;
     const gasLimit = '0x100000';
     const value = 1000;
     const data = '0xaabbccdd';

     expect(() => {
      generateTypeZeroTxJSONFromParams(nonce, gasPrice, gasLimit, value, data, {
       to: 'aabbccdd',
      });
     }).to.throw(
      "'to' should be a valid Ethereum address (hex string starting with '0x' and 42 characters long)"
     );
    });

    it('should throw when giving to field as a number', () => {
     const nonce = '0x0';
     const gasPrice = 2770000;
     const gasLimit = '0x100000';
     const value = 1000;
     const data = '0xaabbccdd';

     expect(() => {
      generateTypeZeroTxJSONFromParams(nonce, gasPrice, gasLimit, value, data, {
       to: 288,
      });
     }).to.throw(
      "'to' should be a valid Ethereum address (hex string starting with '0x' and 42 characters long)"
     );
    });

    describe('when giving full signature values in a wrong format=', () => {
     it('should throw when giving r field as a number', () => {
      const nonce = '0x0';
      const gasPrice = 2770000;
      const gasLimit = '0x100000';
      const value = 1000;
      const data = '0xaabbccdd';

      expect(() => {
       generateTypeZeroTxJSONFromParams(
        nonce,
        gasPrice,
        gasLimit,
        value,
        data,
        {
         v: 288,
         r: '12',
         s: '0x1212121212121212121212121212121212121212121212121212121212121212',
        }
       );
      }).to.throw(
       "'r' should be a hex string with a length of 32 bytes (66 characters) starting with '0x'"
      );
     });

     it('should throw when giving r field as a short hex', () => {
      const nonce = '0x0';
      const gasPrice = 2770000;
      const gasLimit = '0x100000';
      const value = 1000;
      const data = '0xaabbccdd';

      expect(() => {
       generateTypeZeroTxJSONFromParams(
        nonce,
        gasPrice,
        gasLimit,
        value,
        data,
        {
         v: 288,
         r: '0x1212',
         s: '0x1212121212121212121212121212121212121212121212121212121212121212',
        }
       );
      }).to.throw(
       "'r' should be a hex string with a length of 32 bytes (66 characters) starting with '0x'"
      );
     });

     it('should throw when giving s field as a number', () => {
      const nonce = '0x0';
      const gasPrice = 2770000;
      const gasLimit = '0x100000';
      const value = 1000;
      const data = '0xaabbccdd';

      expect(() => {
       generateTypeZeroTxJSONFromParams(
        nonce,
        gasPrice,
        gasLimit,
        value,
        data,
        {
         v: 288,
         s: '12',
         r: '0x1212121212121212121212121212121212121212121212121212121212121212',
        }
       );
      }).to.throw(
       "'s' should be a hex string with a length of 32 bytes (66 characters) starting with '0x'"
      );
     });

     it('should throw when giving s field as a short hex', () => {
      const nonce = '0x0';
      const gasPrice = 2770000;
      const gasLimit = '0x100000';
      const value = 1000;
      const data = '0xaabbccdd';

      expect(() => {
       generateTypeZeroTxJSONFromParams(
        nonce,
        gasPrice,
        gasLimit,
        value,
        data,
        {
         v: 288,
         s: '0x1212',
         r: '0x1212121212121212121212121212121212121212121212121212121212121212',
        }
       );
      }).to.throw(
       "'s' should be a hex string with a length of 32 bytes (66 characters) starting with '0x'"
      );
     });

     it('should throw when giving v field as a string', () => {
      const nonce = '0x0';
      const gasPrice = 2770000;
      const gasLimit = '0x100000';
      const value = 1000;
      const data = '0xaabbccdd';

      expect(() => {
       generateTypeZeroTxJSONFromParams(
        nonce,
        gasPrice,
        gasLimit,
        value,
        data,
        {
         v: 'hello',
         s: '0x1212121212121212121212121212121212121212121212121212121212121212',
         r: '0x1212121212121212121212121212121212121212121212121212121212121212',
        }
       );
      }).to.throw("'v' should be a number or a hex string starting with '0x'");
     });
    });
   });
   describe('when providing the parameters in a correct format', () => {
    describe('when providing v value as number', () => {
     it('should pass and return it as a hex', () => {
      const nonce = '0x0';
      const gasPrice = 2770000;
      const gasLimit = '0x100000';
      const value = 1000;
      const data = '0xaabbccdd';
      const v = 27;
      const r =
       '0x1212121212121212121212121212121212121212121212121212121212121212';
      const s =
       '0x1212121212121212121212121212121212121212121212121212121212121212';

      const txParams = generateTypeZeroTxJSONFromParams(
       nonce,
       gasPrice,
       gasLimit,
       value,
       data,
       {
        v,
        r,
        s,
       }
      );
      expect(txParams).to.have.property('nonce', nonce);
      expect(txParams).to.have.property(
       'gasPrice',
       `0x${gasPrice.toString(16)}`
      );
      expect(txParams).to.have.property('gasLimit', gasLimit);
      expect(txParams).to.have.property('value', `0x${value.toString(16)}`);
      expect(txParams).to.have.property('data', data);
      expect(txParams).to.have.property('v', `0x${v.toString(16)}`);
      expect(txParams).to.have.property('r', r);
      expect(txParams).to.have.property('s', s);
     });
    });

    describe('when providing v value as hex', () => {
     it('should pass and keep it as a hex', () => {
      const nonce = '0x0';
      const gasPrice = 2770000;
      const gasLimit = '0x100000';
      const value = 1000;
      const data = '0xaabbccdd';
      const v = '0x1b';
      const r =
       '0x1212121212121212121212121212121212121212121212121212121212121212';
      const s =
       '0x1212121212121212121212121212121212121212121212121212121212121212';

      const txParams = generateTypeZeroTxJSONFromParams(
       nonce,
       gasPrice,
       gasLimit,
       value,
       data,
       {
        v,
        r,
        s,
       }
      );
      expect(txParams).to.have.property('nonce', nonce);
      expect(txParams).to.have.property(
       'gasPrice',
       `0x${gasPrice.toString(16)}`
      );
      expect(txParams).to.have.property('gasLimit', gasLimit);
      expect(txParams).to.have.property('value', `0x${value.toString(16)}`);
      expect(txParams).to.have.property('data', data);
      expect(txParams).to.have.property('v', v);
      expect(txParams).to.have.property('r', r);
      expect(txParams).to.have.property('s', s);
     });
    });

    describe('when providing signature param as hex', () => {
     it('should pass', () => {
      const nonce = '0x0';
      const gasPrice = 2770000;
      const gasLimit = '0x100000';
      const value = 1000;
      const data = '0xaabbccdd';
      const v = '0x1b';
      const r =
       '0x1212121212121212121212121212121212121212121212121212121212121212';
      const s =
       '0x1212121212121212121212121212121212121212121212121212121212121212';

      const txParams = generateTypeZeroTxJSONFromParams(
       nonce,
       gasPrice,
       gasLimit,
       value,
       data,
       {
        v,
        r,
        s,
       }
      );
      expect(txParams).to.have.property('nonce', nonce);
      expect(txParams).to.have.property(
       'gasPrice',
       `0x${gasPrice.toString(16)}`
      );
      expect(txParams).to.have.property('gasLimit', gasLimit);
      expect(txParams).to.have.property('value', `0x${value.toString(16)}`);
      expect(txParams).to.have.property('data', data);
      expect(txParams).to.have.property('v', v);
      expect(txParams).to.have.property('r', r);
      expect(txParams).to.have.property('s', s);
     });
    });

    describe('when providing all the optional param', () => {
     it('should pass and have all properties', () => {
      const nonce = '0x0';
      const gasPrice = 2770000;
      const gasLimit = '0x100000';
      const value = 1000;
      const data = '0xaabbccdd';
      const to = '0xcafecafecafecafecafecafecafecafecafecafe';
      const v = '0x1b';
      const r =
       '0x1212121212121212121212121212121212121212121212121212121212121212';
      const s =
       '0x1212121212121212121212121212121212121212121212121212121212121212';

      const txParams = generateTypeZeroTxJSONFromParams(
       nonce,
       gasPrice,
       gasLimit,
       value,
       data,
       {
        to,
        v,
        r,
        s,
       }
      );

      expect(txParams).to.have.property('nonce', nonce);
      expect(txParams).to.have.property(
       'gasPrice',
       `0x${gasPrice.toString(16)}`
      );
      expect(txParams).to.have.property('gasLimit', gasLimit);
      expect(txParams).to.have.property('value', `0x${value.toString(16)}`);
      expect(txParams).to.have.property('data', data);
      expect(txParams).to.have.property('to', to);
      expect(txParams).to.have.property('v', v);
      expect(txParams).to.have.property('r', r);
      expect(txParams).to.have.property('s', s);
     });
    });
   });

   describe('when providing not the full signature value', () => {
    describe('when not providing the v param', () => {
     it('should throw', () => {
      const nonce = '0x0';
      const gasPrice = 2770000;
      const gasLimit = '0x100000';
      const value = 1000;
      const data = '0xaabbccdd';
      const to = '0xcafecafecafecafecafecafecafecafecafecafe';
      const r =
       '0x1212121212121212121212121212121212121212121212121212121212121212';
      const s =
       '0x1212121212121212121212121212121212121212121212121212121212121212';

      expect(() => {
       generateTypeZeroTxJSONFromParams(
        nonce,
        gasPrice,
        gasLimit,
        value,
        data,
        { to, s, r }
       );
      }).to.throw(
       "'v', 'r', and 's' should all be provided together or none of them should be provided."
      );
     });
    });
    describe('when not providing the r param', () => {
     it('should throw', () => {
      const nonce = '0x0';
      const gasPrice = 2770000;
      const gasLimit = '0x100000';
      const value = 1000;
      const data = '0xaabbccdd';
      const to = '0xcafecafecafecafecafecafecafecafecafecafe';
      const v = 28;
      const s =
       '0x1212121212121212121212121212121212121212121212121212121212121212';

      expect(() => {
       generateTypeZeroTxJSONFromParams(
        nonce,
        gasPrice,
        gasLimit,
        value,
        data,
        { to, v, s }
       );
      }).to.throw(
       "'v', 'r', and 's' should all be provided together or none of them should be provided."
      );
     });
    });

    describe('when not providing the s param', () => {
     it('should throw', () => {
      const nonce = '0x0';
      const gasPrice = 2770000;
      const gasLimit = '0x100000';
      const value = 1000;
      const data = '0xaabbccdd';
      const to = '0xcafecafecafecafecafecafecafecafecafecafe';
      const v = 28;
      const r =
       '0x1212121212121212121212121212121212121212121212121212121212121212';

      expect(() => {
       generateTypeZeroTxJSONFromParams(
        nonce,
        gasPrice,
        gasLimit,
        value,
        data,
        { to, v, r }
       );
      }).to.throw(
       "'v', 'r', and 's' should all be provided together or none of them should be provided."
      );
     });
    });
   });
  });
 });

 describe('generateNickMethodConfigForContractDeployment', () => {
  describe('when not providing anything', () => {
   it('should throw', () => {
    expect(() => {
     generateNickMethodConfigForContractDeployment();
    }).to.throw('txParams parameter is required');
   });
  });
  describe('when not providing all the needed parameters', () => {
   describe('when not providing the gasPrice', () => {
    it('should throw', () => {
     const txParams = {
      gasLimit: '0x11bb',
      data: '0xaabbccdd',
     };
     expect(() => {
      generateNickMethodConfigForContractDeployment(txParams);
     }).to.throw(
      'txParams must include gasLimit, gasPrice, and data properties'
     );
    });
   });
   describe('when not providing the gasLimit', () => {
    it('should throw', () => {
     const txParams = {
      gasPrice: '0xaabbccdd',
      data: '0xaabbccdd',
     };
     expect(() => {
      generateNickMethodConfigForContractDeployment(txParams);
     }).to.throw(
      'txParams must include gasLimit, gasPrice, and data properties'
     );
    });
   });
   describe('when not providing the data', () => {
    it('should throw', () => {
     const txParams = {
      gasLimit: '0x11bb',
      gasPrice: '0xaabbccdd',
     };
     expect(() => {
      generateNickMethodConfigForContractDeployment(txParams);
     }).to.throw(
      'txParams must include gasLimit, gasPrice, and data properties'
     );
    });
   });
  });
  describe('when providing the parameters in the wrong format', () => {
   describe('when providing the gasPrice in a wrong format', () => {
    it('should throw', () => {
     const txParams = {
      gasLimit: '0x11bb',
      gasPrice: 'aabbccdd',
      data: '0xaabbccdd',
     };
     expect(() => {
      generateNickMethodConfigForContractDeployment(txParams);
     }).to.throw(
      'The gasPrice parameter must be a hexadecimal string or a number'
     );
    });
   });
   describe('when providing the gasLimit in a wrong format', () => {
    it('should throw', () => {
     const txParams = {
      gasLimit: true,
      gasPrice: '0xaabbccdd',
      data: '0xaabbccdd',
     };
     expect(() => {
      generateNickMethodConfigForContractDeployment(txParams);
     }).to.throw(
      'The gasLimit parameter must be a hexadecimal string or a number'
     );
    });
   });
   describe('when providing the data in a wrong format', () => {
    it('should throw', () => {
     const txParams = {
      gasLimit: '0x1122',
      gasPrice: '0xaabbccdd',
      data: 27,
     };
     expect(() => {
      generateNickMethodConfigForContractDeployment(txParams);
     }).to.throw("'data' should be a hex string starting with '0x'");
    });
   });

   describe('when providing the value in a wrong format', () => {
    it('should throw', () => {
     const txParams = {
      gasLimit: '0x1122',
      gasPrice: '0xaabbccdd',
      data: '0x1122aabbccdd',
      value: true,
     };
     expect(() => {
      generateNickMethodConfigForContractDeployment(txParams);
     }).to.throw(
      'The value parameter must be a hexadecimal string or a number'
     );
    });
   });

   describe('when providing the nonce in a wrong format', () => {
    it('should throw', () => {
     const txParams = {
      gasLimit: '0x1122',
      gasPrice: '0xaabbccdd',
      data: '0x1122aabbccdd',
      value: 0,
      nonce: 'hello',
     };
     expect(() => {
      generateNickMethodConfigForContractDeployment(txParams);
     }).to.throw('The nonce must be either 0 or 0x00 for contract deployment');
    });
   });
  });
  describe('when providing the parameters in number should convert to hex', () => {
   const txParams = {
    gasLimit: 3723,
    gasPrice: 373,
    value: 9,
    nonce: 0,
    data: '0xaabbccdd',
   };

   const nickMethodConfig =
    generateNickMethodConfigForContractDeployment(txParams);

   expect(nickMethodConfig).to.have.property(
    'gasPrice',
    `${txParams.gasPrice.toString(16)}`
   );
   expect(nickMethodConfig).to.have.property(
    'gasLimit',
    `${txParams.gasLimit.toString(16)}`
   );
  });
  describe('when providing all the needed parameters', () => {
   it('should consider the v value as 0x1b = 27', () => {
    const txParams = {
     gasLimit: 3723,
     gasPrice: 373,
     value: 9,
     nonce: 0,
     data: '0xaabbccdd',
    };

    const nickMethodConfig =
     generateNickMethodConfigForContractDeployment(txParams);

    expect(nickMethodConfig).to.have.property('v', `0x1b`);
   });
   it('should consider the r value as 0x121212..', () => {
    const txParams = {
     gasLimit: 3723,
     gasPrice: 373,
     value: 9,
     nonce: 0,
     data: '0xaabbccdd',
    };

    const nickMethodConfig =
     generateNickMethodConfigForContractDeployment(txParams);

    expect(nickMethodConfig).to.have.property(
     'r',
     `0x1212121212121212121212121212121212121212121212121212121212121212`
    );
   });
  });

  describe('when providing the chainId as optional parameters', () => {
   it('should return a v value corresponding to the chainId', () => {
    const txParams = {
     gasLimit: 3723,
     gasPrice: 373,
     value: 9,
     nonce: 0,
     data: '0xaabbccdd',
    };

    const opt = {
     chainId: 1,
    };

    const nickMethodConfig = generateNickMethodConfigForContractDeployment(
     txParams,
     opt
    );

    expect(nickMethodConfig).to.have.property('v', `0x25`);
   });
  });
  describe('when providing signature values as optional parameters ', () => {
   describe('when providing the r value', () => {
    it('should return the provided value r in the config', () => {
     const txParams = {
      gasLimit: 3723,
      gasPrice: 373,
      value: 9,
      nonce: 0,
      data: '0xaabbccdd',
     };

     const opt = {
      r: '0x1221122112211221122112211221122112211221122112211221122112211221',
     };

     const nickMethodConfig = generateNickMethodConfigForContractDeployment(
      txParams,
      opt
     );

     expect(nickMethodConfig).to.have.property('r', opt.r);
    });
   });
   describe('when providing the s value', () => {
    it('should return the provided value s in the config', () => {
     const txParams = {
      gasLimit: 3723,
      gasPrice: 373,
      value: 9,
      nonce: 0,
      data: '0xaabbccdd',
     };

     const opt = {
      s: '0x4141414141414141414141414141414141414141414141414141414141414141',
     };

     const nickMethodConfig = generateNickMethodConfigForContractDeployment(
      txParams,
      opt
     );

     expect(nickMethodConfig).to.have.property('s', opt.s);
    });
   });
  });
 });

 describe('generateNickMethodConfigForContractDeployment', () => {
  describe('when not providing anything', () => {
   it('should throw', () => {
    expect(() => {
     generateTypeZeroTxNickMethodConfig();
    }).to.throw('txParams parameter is required');
   });
  });
  describe('when not providing all the needed parameters', () => {
   describe('when not providing the gasPrice', () => {
    it('should throw', () => {
     const txParams = {
      gasLimit: '0x11bb',
      data: '0xaabbccdd',
     };
     expect(() => {
      generateTypeZeroTxNickMethodConfig(txParams);
     }).to.throw(
      'txParams must include gasLimit, gasPrice, and data properties'
     );
    });
   });
   describe('when not providing the gasLimit', () => {
    it('should throw', () => {
     const txParams = {
      gasPrice: '0xaabbccdd',
      data: '0xaabbccdd',
     };
     expect(() => {
      generateTypeZeroTxNickMethodConfig(txParams);
     }).to.throw(
      'txParams must include gasLimit, gasPrice, and data properties'
     );
    });
   });
   describe('when not providing the data', () => {
    it('should throw', () => {
     const txParams = {
      gasLimit: '0x11bb',
      gasPrice: '0xaabbccdd',
     };
     expect(() => {
      generateTypeZeroTxNickMethodConfig(txParams);
     }).to.throw(
      'txParams must include gasLimit, gasPrice, and data properties'
     );
    });
   });
  });
  describe('when providing the parameters in the wrong format', () => {
   describe('when providing the gasPrice in a wrong format', () => {
    it('should throw', () => {
     const txParams = {
      gasLimit: '0x11bb',
      gasPrice: 'aabbccdd',
      data: '0xaabbccdd',
     };
     expect(() => {
      generateTypeZeroTxNickMethodConfig(txParams);
     }).to.throw(
      'The gasPrice parameter must be a hexadecimal string or a number'
     );
    });
   });
   describe('when providing the gasLimit in a wrong format', () => {
    it('should throw', () => {
     const txParams = {
      gasLimit: true,
      gasPrice: '0xaabbccdd',
      data: '0xaabbccdd',
     };
     expect(() => {
      generateTypeZeroTxNickMethodConfig(txParams);
     }).to.throw(
      'The gasLimit parameter must be a hexadecimal string or a number'
     );
    });
   });
   describe('when providing the data in a wrong format', () => {
    it('should throw', () => {
     const txParams = {
      gasLimit: '0x1122',
      gasPrice: '0xaabbccdd',
      data: 27,
     };
     expect(() => {
      generateTypeZeroTxNickMethodConfig(txParams);
     }).to.throw("'data' should be a hex string starting with '0x'");
    });
   });

   describe('when providing the value in a wrong format', () => {
    it('should throw', () => {
     const txParams = {
      gasLimit: '0x1122',
      gasPrice: '0xaabbccdd',
      data: '0x1122aabbccdd',
      value: true,
     };
     expect(() => {
      generateTypeZeroTxNickMethodConfig(txParams);
     }).to.throw(
      'The value parameter must be a hexadecimal string or a number'
     );
    });
   });

   describe('when providing the nonce in a wrong format', () => {
    it('should throw', () => {
     const txParams = {
      gasLimit: '0x1122',
      gasPrice: '0xaabbccdd',
      data: '0x1122aabbccdd',
      value: 0,
      nonce: 'hello',
     };
     expect(() => {
      generateTypeZeroTxNickMethodConfig(txParams);
     }).to.throw('The nonce must be either 0 or 0x00 for contract deployment');
    });
   });
  });
  describe('when providing the parameters in number should convert to hex', () => {
   const txParams = {
    gasLimit: 3723,
    gasPrice: 373,
    value: 9,
    nonce: 0,
    data: '0xaabbccdd',
   };

   const nickMethodConfig = generateTypeZeroTxNickMethodConfig(txParams);

   expect(nickMethodConfig).to.have.property(
    'gasPrice',
    `${txParams.gasPrice.toString(16)}`
   );
   expect(nickMethodConfig).to.have.property(
    'gasLimit',
    `${txParams.gasLimit.toString(16)}`
   );
  });
  describe('when providing all the needed parameters', () => {
   it('should consider the v value as 0x1b = 27', () => {
    const txParams = {
     gasLimit: 3723,
     gasPrice: 373,
     value: 9,
     nonce: 0,
     data: '0xaabbccdd',
    };

    const nickMethodConfig = generateTypeZeroTxNickMethodConfig(txParams);

    expect(nickMethodConfig).to.have.property('v', `0x1b`);
   });
   it('should consider the r value as 0x121212..', () => {
    const txParams = {
     gasLimit: 3723,
     gasPrice: 373,
     value: 9,
     nonce: 0,
     data: '0xaabbccdd',
    };

    const nickMethodConfig = generateTypeZeroTxNickMethodConfig(txParams);

    expect(nickMethodConfig).to.have.property(
     'r',
     `0x1212121212121212121212121212121212121212121212121212121212121212`
    );
   });
  });

  describe('when providing the chainId as optional parameters', () => {
   it('should return a v value corresponding to the chainId', () => {
    const txParams = {
     gasLimit: 3723,
     gasPrice: 373,
     value: 9,
     nonce: 0,
     data: '0xaabbccdd',
    };

    const opt = {
     chainId: 1,
    };

    const nickMethodConfig = generateTypeZeroTxNickMethodConfig(txParams, opt);

    expect(nickMethodConfig).to.have.property('v', `0x25`);
   });
  });
  describe('when providing signature values as optional parameters ', () => {
   describe('when providing the r value', () => {
    it('should return the provided value r in the config', () => {
     const txParams = {
      gasLimit: 3723,
      gasPrice: 373,
      value: 9,
      nonce: 0,
      data: '0xaabbccdd',
     };

     const opt = {
      r: '0x1221122112211221122112211221122112211221122112211221122112211221',
     };

     const nickMethodConfig = generateTypeZeroTxNickMethodConfig(txParams, opt);

     expect(nickMethodConfig).to.have.property('r', opt.r);
    });
   });
   describe('when providing the s value', () => {
    it('should return the provided value s in the config', () => {
     const txParams = {
      gasLimit: 3723,
      gasPrice: 373,
      value: 9,
      nonce: 0,
      data: '0xaabbccdd',
     };

     const opt = {
      s: '0x4141414141414141414141414141414141414141414141414141414141414141',
     };

     const nickMethodConfig = generateTypeZeroTxNickMethodConfig(txParams, opt);

     expect(nickMethodConfig).to.have.property('s', opt.s);
    });
   });
  });
 });

 describe('getTypeZeroTxExecutionCost', () => {
  it('should return the correct multiplication of gasPrice and gasLimit + value', () => {
   const txParams = {
    gasLimit: 3723,
    gasPrice: 373,
    value: 9,
    nonce: 0,
    data: '0xaabbccdd',
   };

   const sum = txParams.gasLimit * txParams.gasPrice + txParams.value;
   const result = getTypeZeroTxExecutionCost(txParams);
   expect(result).to.equal(sum.toString());
  });

  it('should return the correct multiplication of gasPrice and gasLimit + value when given in hex', () => {
   const txParams = {
    gasLimit: '0x12',
    gasPrice: 373,
    value: 9,
    nonce: 0,
    data: '0xaabbccdd',
   };

   const sum = txParams.gasLimit * txParams.gasPrice + txParams.value;
   const result = getTypeZeroTxExecutionCost(txParams);
   expect(result).to.equal(sum.toString());
  });
 });

 describe('getTypeZeroTxGasCost', () => {
  it('should return the correct multiplication of gasPrice and gasLimit without value', () => {
   const txParams = {
    gasLimit: 3723,
    gasPrice: 373,
    value: 9,
    nonce: 0,
    data: '0xaabbccdd',
   };

   const sum = txParams.gasLimit * txParams.gasPrice;
   const result = getTypeZeroTxGasCost(txParams);
   expect(result).to.equal(sum.toString());
  });

  it('should return the correct multiplication of gasPrice and gasLimit without value when given in hex', () => {
   const txParams = {
    gasLimit: '0x12',
    gasPrice: 373,
    value: 9,
    nonce: 0,
    data: '0xaabbccdd',
   };

   const sum = txParams.gasLimit * txParams.gasPrice;
   const result = getTypeZeroTxGasCost(txParams);
   expect(result).to.equal(sum.toString());
  });
 });

 describe.only('test', () => {
  it('tets', () => {
   let txParams = {
    nonce: 0,
    value: 0,
    gasPrice: 1000000000000,
    gasLimit: 1000000,
    data:
     '0x608060405234801561001057600080fd5b50610409806100206000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c8063251c1aa3146100465780633ccfd60b146100645780638da5cb5b1461006e575b600080fd5b61004e61008c565b60405161005b919061024a565b60405180910390f35b61006c610092565b005b61007661020b565b60405161008391906102a6565b60405180910390f35b60005481565b6000544210156100d7576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016100ce9061031e565b60405180910390fd5b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610167576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161015e9061038a565b60405180910390fd5b7fbf2ed60bd5b5965d685680c01195c9514e4382e28e3a5a2d2d5244bf59411b9347426040516101989291906103aa565b60405180910390a1600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc479081150290604051600060405180830381858888f19350505050158015610208573d6000803e3d6000fd5b50565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000819050919050565b61024481610231565b82525050565b600060208201905061025f600083018461023b565b92915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061029082610265565b9050919050565b6102a081610285565b82525050565b60006020820190506102bb6000830184610297565b92915050565b600082825260208201905092915050565b7f596f752063616e27742077697468647261772079657400000000000000000000600082015250565b60006103086016836102c1565b9150610313826102d2565b602082019050919050565b60006020820190508181036000830152610337816102fb565b9050919050565b7f596f75206172656e277420746865206f776e6572000000000000000000000000600082015250565b60006103746014836102c1565b915061037f8261033e565b602082019050919050565b600060208201905081810360008301526103a381610367565b9050919050565b60006040820190506103bf600083018561023b565b6103cc602083018461023b565b939250505056fea26469706673582212207b452c9321dd61a86b485c4b42671f2f2281ffde00cef2006eed398b2a3d97d064736f6c63430008110033',
   };

   const config = generateNickMethodConfigForContractDeployment(txParams);
   console.log(config);
  });
 });
});
