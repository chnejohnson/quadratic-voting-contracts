import hre, { ethers } from "hardhat";
import fs from "fs";
import path from "path";
import { Keypair, PrivKey } from "maci-domainobjs";
import { Addresses } from "../../ts/interfaces";
import { Poll__factory } from "../../build/typechain/factories/Poll__factory";
import { MACI__factory } from "../../build/typechain/factories/MACI__factory";
import { checkDeployment, checkEnvFile } from "../../ts/utils";
import vote from "../../ts/vote";

const pollId = 0;

// .env
const userPrivKey = process.env.USER_PRIV_KEY as string;
const userKeypair = new Keypair(PrivKey.unserialize(userPrivKey));

const votes = [
  {
    stateIndex: 1,
    voteOptionIndex: 0,
    newVoteWeight: 4,
    nonce: 1,
    pollId,
  },
  {
    stateIndex: 1,
    voteOptionIndex: 1,
    newVoteWeight: 1,
    nonce: 2,
    pollId,
  },
  {
    stateIndex: 1,
    voteOptionIndex: 3,
    newVoteWeight: 3,
    nonce: 3,
    pollId,
  },
];

const deploymentFileName = `deployment-${hre.network.name}.json`;
const deploymentPath = path.join(
  __dirname,
  "../../deployment",
  deploymentFileName
);

async function main() {
  checkEnvFile("USER_PRIV_KEY", "COORDINATOR_PUB_KEY");
  const [deployer] = await ethers.getSigners();

  const addresses = JSON.parse(
    fs.readFileSync(deploymentPath).toString()
  ) as Addresses;
  checkDeployment(addresses);

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

  const pollAddress = await maci.getPoll(pollId);
  const poll = new Poll__factory(
    { ...linkedLibraryAddresses },
    deployer
  ).attach(pollAddress);

  for (let i = votes.length - 1; i >= 0; i--) {
    await vote(poll, votes[i], userKeypair.pubKey, userKeypair.privKey);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
