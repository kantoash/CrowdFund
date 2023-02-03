// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.

const { ethers, network } = require("hardhat");
const hre = require("hardhat");


async function main() {
    const CrowdFunding = await ethers.getContractFactory("CrowdFunding");
    const crowdfunding = await CrowdFunding.deploy(ethers.utils.parseEther("0.05"));
    await crowdfunding.deployed()
    console.log("this is address => ",crowdfunding.address);//  0x0ddB707b907dc2023e2F84B82B700551CccE94a7
    
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
