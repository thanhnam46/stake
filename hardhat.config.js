require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

const ETH_PRIVATE_KEY = '7c003e356ba88c552223628808627d8b02eb94c62aebc49ebf779bee9c69a084'
const INFURA_URL = 'https://rinkeby.infura.io/v3/5867d2fc9f6c483c8cb585522fc3f1f0'

const BSC_PRIVATE_KEY = '7c003e356ba88c552223628808627d8b02eb94c62aebc49ebf779bee9c69a084'
const BSC_TESTNET_URL = 'https://data-seed-prebsc-1-s1.binance.org:8545'

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    rinkeby: {
      url: INFURA_URL,
      accounts: [`0x${ETH_PRIVATE_KEY}`]
    },
    bscTestnet: {
      url: BSC_TESTNET_URL,
      accounts: [`0x${BSC_PRIVATE_KEY}`]
    }
  },
  etherscan: {
    apiKey: {
      rinkeby: 'W4K3TK5FDM78RFSEKB6EQNI37KTZE773FN',
      bscTestnet: 'GJ2WRJFCECDEDPIC5G5NZK4UUTCGWCKCJG'
    }
  },
};
