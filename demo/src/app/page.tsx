"use client";

import { useState } from "react";
import Header from "./components/Header";
import {
  SismoConnectButton,
  SismoConnectResponse,
  SismoConnectVerifiedResult,
} from "@sismo-core/sismo-connect-react";
import {
  CONFIG,
  AUTHS,
  CLAIMS,
  SIGNATURE_REQUEST,
  AuthType,
  ClaimType,
} from "./sismo-connect-config";
import {ethers} from 'ethers';

import { makeEcdsaModuleUserOp } from '../../../test/utils/userOp'
import {
	getEcdsaOwnershipRegistryModule,
	getEntryPoint,
	getMockToken,
	getSmartAccountFactory,
	getSmartAccountImplementation,
	getSmartAccountWithModule,
	getVerifyingPaymaster,
} from '../../../test/utils/setupHelper';
const COMPANY_ADDRESS = '0xf3308Cfc92e0166D3811e09E2360A31D85312500'

export default function Home() {
  const [sismoConnectVerifiedResult, setSismoConnectVerifiedResult] =
    useState<SismoConnectVerifiedResult>();
  const [sismoConnectResponse, setSismoConnectResponse] = useState<SismoConnectResponse>();
  const [pageState, setPageState] = useState<string>("init");
  const [error, setError] = useState<string>("");

  return (
    <>
      <main className="main">
        <Header />
        {pageState == "init" ? (
          <>
            <SismoConnectButton
              config={CONFIG}
              // Auths = Data Source Ownership Requests. (e.g Wallets, Github, Twitter, Github)
              auths={AUTHS}
              // Claims = prove group membership of a Data Source in a specific Data Group.
              // (e.g ENS DAO Voter, Minter of specific NFT, etc.)
              // Data Groups = [{[dataSource1]: value1}, {[dataSource1]: value1}, .. {[dataSource]: value}]
              // Existing Data Groups and how to create one: https://factory.sismo.io/groups-explorer
              claims={CLAIMS}
              // Signature = user can sign a message embedded in their zk proof
              signature={SIGNATURE_REQUEST}
              text="Prove With Sismo"
              // Triggered when received Sismo Connect response from user data vault
              onResponse={async (response: SismoConnectResponse) => {
                setSismoConnectResponse(response);
                setPageState("verifying");
                const proofAuth = response?.proofs?.find(proof => !!proof.auths?.length)?.auths?.find(auth => auth.authType === AuthType.EVM_ACCOUNT)
                const actorAddress = proofAuth?.userId
                console.log('user address', actorAddress)
                console.log(JSON.stringify(response))

                try {
                  window.ethereum.enable()
                  const provider = new ethers.providers.Web3Provider(window.ethereum, "any")
                  await provider.send("eth_requestAccounts", [])
                  const signer = provider.getSigner()
                  // const [_, smartAccountOwner] = await hardhatEthers.getSigners();
                  // const ownerAddress = "0xb256349E861b5f942E3D9e675CFda632758c798a"
                  const ecdsaModule = await getEcdsaOwnershipRegistryModule();
                  const entryPoint = await getEntryPoint();
                  // const sessionKeyManager = await (await hardhatEthers.getContractFactory('SessionKeyManager')).deploy();
                  let userOp = await makeEcdsaModuleUserOp(
                    'enableModule',
                    ["0x71bA2429BCc2aB6Bcd40D96D3d8644115fd9D76B"],
                    COMPANY_ADDRESS,
                    signer,
                    entryPoint,
                    ecdsaModule.address
                  );
              
                  await new Promise((f) => setTimeout(f, 10000));
                  await entryPoint.handleOps([userOp], actorAddress);
                } catch (err) {
                  console.log('error setting up smart account... ', err)
                }

                /* if (verifiedResult.ok) {
                  setSismoConnectVerifiedResult(data);
                  setPageState("verified");
                } else {
                  setPageState("error");
                  setError(data);
                } */
              }}
            />
          </>
        ) : (
          <>
            <button
              onClick={() => {
                window.location.href = "/";
              }}
            >
              {" "}
              RESET{" "}
            </button>
            <br></br>
            <div className="status-wrapper">
              {pageState == "verifying" ? (
                <span className="verifying"> Verifying ZK Proofs... </span>
              ) : (
                <>
                  {Boolean(error) ? (
                    <span className="error"> Error verifying ZK Proofs: {error} </span>
                  ) : (
                    <span className="verified"> ZK Proofs verified!</span>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </main>
    </>
  );
}
