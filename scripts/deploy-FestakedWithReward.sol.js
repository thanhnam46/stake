// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const FestakedWithReward = await hre.ethers.getContractFactory("FestakedWithReward",{
    libraries: {
      FestakedLib: "0x4a82768Db3cB87aF402F5882566AbD31cB8d901f",
    },
  });
  const stakingContract = await FestakedWithReward.deploy(
    "Nam test Staking contract 1", //Name
    "0x2d5cC8299128c2a44a2514809c5C4FD98F6D134a", //token address
    "0x2d5cC8299128c2a44a2514809c5C4FD98F6D134a", //rewardTokenAddress_
    "1649840450", //stakingStarts_
    "1649926850", //stakingEnds_
    "1650018485", //withdrawStarts_
    "1650104885", //withdrawEnds_
    "80000000000000000000", //stakingCap_
    {gasLimit: 10000000}    
    );

  await stakingContract.deployed();

  console.log("Staking contract deployed to:", stakingContract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
