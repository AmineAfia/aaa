import {
  ClaimType,
  AuthType,
  SignatureRequest,
  AuthRequest,
  ClaimRequest,
  SismoConnectConfig,
} from "@sismo-core/sismo-connect-client";

export { ClaimType, AuthType };
export const CONFIG: SismoConnectConfig = {
  appId: "0xa5ccb95f10e63bd84cef8f0a5556652c",
  vault: {
    // For development purposes insert the Data Sources that you want to impersonate
    // Never use this in production
    impersonate: [
      "vitalik.eth"
      /* // EVM Data Sources
      "dhadrien.sismo.eth",
      "0xA4C94A6091545e40fc9c3E0982AEc8942E282F38",
      "0x1b9424ed517f7700e7368e34a9743295a225d889",
      "0x82fbed074f62386ed43bb816f748e8817bf46ff7",
      "0xc281bd4db5bf94f02a8525dca954db3895685700",
      // Github Data Source
      "github:dhadrien",
      // Twitter Data Source
      "twitter:dhadrien_",
      // Telegram Data Source
      "telegram:dhadrien", */
    ],
  },
  // displayRawResponse: true, // this enables you to get access directly to the
  // Sismo Connect Response in the vault instead of redirecting back to the app
};

// Request users to prove ownership of a Data Source (Wallet, Twitter, Github, Telegram, etc.)
export const AUTHS: AuthRequest[] = [
  // Anonymous identifier of the vault for this app
  // vaultId = hash(vaultSecret, appId).
  // full docs: https://docs.sismo.io/sismo-docs/build-with-sismo-connect/technical-documentation/vault-and-proof-identifiers
  // { authType: AuthType.VAULT },
  { authType: AuthType.EVM_ACCOUNT },
  // { authType: AuthType.GITHUB, isOptional: true },
  // { authType: AuthType.TWITTER, isOptional: true },
  // { authType: AuthType.TELEGRAM, userId: "875608110", isOptional: true },
];

// Request users to prove membership in a Data Group (e.g I own a wallet that is part of a DAO, owns an NFT, etc.)
export const CLAIMS: ClaimRequest[] = [
  {
    groupId: "0xf2c03a86f69a450ab04affeee178a18e"
  },
];

// Request users to sign a message
export const SIGNATURE_REQUEST: SignatureRequest = {
  message: "Voulez-Vous auth ?",
  isSelectableByUser: true,
};
