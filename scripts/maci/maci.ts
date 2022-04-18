import hre, { ethers } from "hardhat";
import path from "path";
import fs from "fs";
import { Addresses } from "../../ts/interfaces";
import { MACI__factory } from "../../typechain/factories/MACI__factory";
import { AccQueue } from "maci-crypto";
import { AccQueueQuinaryMaci__factory } from "../../typechain";

const deploymentFileName = `deployment-${hre.network.name}.json`;
const deploymentPath = path.join(
  __dirname,
  "../../deployment",
  deploymentFileName
);

async function main() {
  const [deployer] = await ethers.getSigners();

  const addresses = JSON.parse(
    fs.readFileSync(deploymentPath).toString()
  ) as Addresses;

  const linkedLibraryAddresses = {
    ["maci-contracts/contracts/crypto/Hasher.sol:PoseidonT5"]:
      addresses.poseidonT5,
    ["maci-contracts/contracts/crypto/Hasher.sol:PoseidonT3"]:
      addresses.poseidonT3,
    ["maci-contracts/contracts/crypto/Hasher.sol:PoseidonT6"]:
      addresses.poseidonT6,
    ["maci-contracts/contracts/crypto/Hasher.sol:PoseidonT4"]:
      addresses.poseidonT4,
  };

  const maci = new MACI__factory(
    { ...linkedLibraryAddresses },
    deployer
  ).attach(addresses.maci);

  const stateAqAddress = await maci.stateAq();
  const stateAq = new AccQueueQuinaryMaci__factory(
    { ...linkedLibraryAddresses },
    deployer
  ).attach(stateAqAddress);

  console.log("stateAq.subTreesMerged:", await stateAq.subTreesMerged());
  console.log("stateAq.treeMerged:", await stateAq.treeMerged());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
