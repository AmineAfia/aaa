import { config } from "dotenv";
import { IBundler, Bundler } from "@biconomy/bundler";
import { ChainId } from "@biconomy/core-types";
import {
  BiconomySmartAccount,
  BiconomySmartAccountConfig,
  DEFAULT_ENTRYPOINT_ADDRESS,
} from "@biconomy/account";
import { Wallet, providers, ethers } from "ethers";

config();
const provider = new providers.JsonRpcProvider(
  "https://rpc.ankr.com/eth_goerli"
);
const wallet = new Wallet(process.env.PRIVATE_KEY || "", provider);
const bundler: IBundler = new Bundler({
  bundlerUrl: "https://bundler.biconomy.io/api/v2/80001/abc",
  chainId: ChainId.GOERLI,
  entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
});

const biconomySmartAccountConfig: BiconomySmartAccountConfig = {
  signer: wallet,
  chainId: ChainId.GOERLI,
  bundler: bundler,
};

// 1. create SAC
async function createAccount() {
  const biconomyAccount = new BiconomySmartAccount(biconomySmartAccountConfig);
  const biconomySmartAccount = await biconomyAccount.init();
  console.log("owner: ", biconomySmartAccount.owner);
  console.log("address: ", await biconomySmartAccount.getSmartAccountAddress());
  return biconomyAccount;
}

// 2. deploy key manager
// 3. deploy validation module
// white list Arsenii
// Arsenii triggers a transaction through the SA


// trigger transaction
async function createTransaction() {
  console.log("creating account");

  const smartAccount = await createAccount();

  const transaction = {
    to: "0x14a4CF64e8BdC492D7fAF782896E22C79334b1Fe",
    data: "0x",
    value: ethers.utils.parseEther("0.1"),
  };

  const userOp = await smartAccount.buildUserOp([transaction]);
  userOp.paymasterAndData = "0x";

  const userOpResponse = await smartAccount.sendUserOp(userOp);

  const transactionDetail = await userOpResponse.wait();

  console.log("transaction detail below");
  console.log(transactionDetail);
}

createTransaction();
