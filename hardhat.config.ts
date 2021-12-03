/**
 * @type import('hardhat/config').HardhatUserConfig
 */

 import '@nomiclabs/hardhat-waffle'
 import dotenv from 'dotenv'
 dotenv.config()
 
module.exports = {
  solidity: {
    version: "0.8.4",
	settings: {
	  optimizer: {
		enabled: true,
	    runs: 999999,
      },
	},
  },
  networks: {
		hardhat: {
			forking: {
				url: process.env.RPC,
			}
		},
	},
}
