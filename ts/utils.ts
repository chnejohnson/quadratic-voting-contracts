import { Addresses } from "./interfaces";

const checkEnvFile = (...args: string[]) => {
  const envs = {
    COORDINATOR_PRIV_KEY: process.env.COORDINATOR_PRIV_KEY,
    COORDINATOR_PUB_KEY: process.env.COORDINATOR_PUB_KEY,

    USER_PRIV_KEY: process.env.USER_PRIV_KEY,

    MAX_MESSAGES: process.env.MAX_MESSAGES,
    MAX_VOTE_OPTIONS: process.env.MAX_VOTE_OPTIONS,

    STATE_TREE_DEPTH: process.env.STATE_TREE_DEPTH,
    INT_STATE_TREE_DEPTH: process.env.INT_STATE_TREE_DEPTH,
    MESSAGE_TREE_DEPTH: process.env.MESSAGE_TREE_DEPTH,
    MESSAGE_TREE_SUB_DEPTH: process.env.MESSAGE_TREE_SUB_DEPTH,
    VOTE_OPTION_TREE_DEPTH: process.env.VOTE_OPTION_TREE_DEPTH,
  };

  if (args.length > 0) {
    args.forEach((key) => {
      if (!envs[key as keyof typeof envs]) {
        throw new Error(`Invalid .env file of ${key}`);
      }
    });
  } else {
    // check all
    for (const [key, value] of Object.entries(envs)) {
      if (!value) {
        throw new Error(`Invalid .env file of ${key}`);
      }
    }
  }
};

const checkDeployment = (addresses: Addresses, ...exclude: string[]) => {
  for (const [key, value] of Object.entries(addresses)) {
    if (exclude && exclude.includes(key)) {
      return;
    }
    if (!value) {
      throw new Error(`Invalid contract address of ${key}`);
    }
  }
};

export { checkEnvFile, checkDeployment };
