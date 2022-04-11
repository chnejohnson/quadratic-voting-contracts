import { ethers } from "hardhat";

const duration = 10000;

async function main() {
  const hardHatProvider = ethers.provider;
  await hardHatProvider.send("evm_increaseTime", [Number(duration) + 1]);
  await hardHatProvider.send("evm_mine", []);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
