
![Voulez-Vous-Auth_Banner](https://github.com/AmineAfia/aaa/assets/9674012/2747b513-b0e3-4f6d-b59f-174b94bff05a)

# Voulez Vous Auth Solution

Voulez-Vous Auth is a single-sign on solution for organisations by using account abstraction and zkProofs

# Project Description
Voulez-Vous Auth is an innovative hackathon project that ingeniously integrates Account Abstraction and zkProofs. This combination allows members of any organization—be it a corporate enterprise, a Decentralized Autonomous Organization (DAO), or even a group of hackathon participants or traders—to access a singular Smart Account using their individual wallets. Although this solution can be employed in various dApp interactions, Voulez-Vous Auth has been specifically fine-tuned to cater to organizations, empowering their members to access the same Smart Account through their own wallets (like a shared wallet). In essence, Voulez-Vous Auth establishes an on-chain single sign-on (SSO) system tailored for organizations/groups of people. This solution is a viable alternative to traditional SSO solutions such as Auth0. Instead of utilizing a common organizational Gmail account for accessing shared resources, Voulez-Vous Auth allows each member to log in to the application using their individual wallets. Consequently, they're authenticated and logged in on behalf of their organization and can act on-chain on behalf of their organisation. This not only bolsters security but also simplifies access to shared accounts, leading to enhanced productivity , better collaboration and streamlined operations.

# How it's Made
The project is built on top of biconomy contracts and sismo connect. the solution deploys the modular smart accounts from biconomy (from this branch https://github.com/bcnmy/scw-contracts/tree/SCW-V2-Modular-SA). Instead of using the the SDK, we deployed the needed AA contracts manually and deployed the SessionKeyManager, then deployed a custom Validation Module to manage sismo proofs. the set of contracts handle authentication, adding and removing users from an organisation. whenever a user is added or removed in sismo connect (thus added or removed from a Sismo Data Group), our Validation Module picks up the user when they try to login using our solution and remembers that the user presented a proof. This way users are added and removed from the org automatically. Our SDK offers the functionality to integrate Voulez Vous in any dapp and abstracts all the logic to manage the sismo proofs and sending userOps to the smart account. We have also built an Admin Console with NextJS, React and WalletConnect to manage organisations, and to onboard new organisational members into the Voulez-Vous Auth experience.

# deploy the smart contracts
To deploy the smart contracts run
```
npx hardhat run ./src/index.ts --network polygon_mumbai
```

# run the admin UI
To run the admin dashboard run
```
cd voulez-vouz-auth-adminConsole-frontend
yarn install
yarn dev
```
