const hre = require('hardhat');

async function main() {
  const NftMarketplace = await hre.ethers.getContractFactory('NFTMarketplace');
  const nftmarketplace = await NftMarketplace.deploy();

  await nftmarketplace.deployed();

  console.log('NFTMARKETPLACE deployed to:', nftmarketplace.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
