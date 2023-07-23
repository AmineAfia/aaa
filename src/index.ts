import {config} from 'dotenv';
import {IBundler, Bundler} from '@biconomy/bundler';
import {ChainId} from '@biconomy/core-types';
import {ethers as hardhatEthers, deployments} from 'hardhat';
import {BiconomySmartAccountConfig, DEFAULT_ENTRYPOINT_ADDRESS} from '@biconomy/account';
import {Wallet, providers, ethers} from 'ethers';
import {makeEcdsaModuleUserOp} from '../test/utils/userOp';
import {
	getEcdsaOwnershipRegistryModule,
	getEntryPoint,
	getMockToken,
	getMockVVASessionKeyData,
	getSmartAccountFactory,
	getSmartAccountImplementation,
	getSmartAccountWithModule,
	getVerifyingPaymaster,
} from '../test/utils/setupHelper';

import {enableNewTreeForSmartAccountViaEcdsa, getERC20SessionKeyParams, getVVASessionKeyParams, makeEcdsaSessionKeySignedUserOp} from '../test/utils/sessionKey';

async function index() {
	config();

	// const provider = new providers.JsonRpcProvider('https://rpc.ankr.com/polygon_mumbai');
	// const wallet = Wallet.fromMnemonic('flight muffin drop correct secret between party holiday powder palm opera once');
	// (process.env.PRIVATE_KEY || '', provider);

	// const smartAccountOwner = wallet.connect(provider);
	var userSA: any = {};
	const maxAmount = ethers.utils.parseEther('100');
	// const [deployer, smartAccountOwner, alice, bob, charlie, verifiedSigner, refundReceiver, sessionKey, nonAuthSessionKey] =
	// 	await hardhatEthers.getSigners();

	// waffle.provider.getWallets();

	// const bundler: IBundler = new Bundler({
	// 	bundlerUrl: 'https://bundler.biconomy.io/api/v2/80001/abc',
	// 	chainId: ChainId.POLYGON_MUMBAI,
	// 	entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
	// });

	// async function createAccount() {
	// 	const ecdsaModule = await getEcdsaOwnershipRegistryModule();
	// 	const EcdsaOwnershipRegistryModule = await hardhatEthers.getContractFactory('EcdsaOwnershipRegistryModule');
	// 	const ownerAddress = await smartAccountOwner.getAddress();
	// 	let ecdsaOwnershipSetupData = EcdsaOwnershipRegistryModule.interface.encodeFunctionData('initForSmartAccount', [ownerAddress]);

	// 	const smartAccountDeploymentIndex = 0;
	// 	const createdUserSA = await getSmartAccountWithModule(ecdsaModule.address, ecdsaOwnershipSetupData, smartAccountDeploymentIndex);
	// 	console.log('SA owner: ', await ecdsaModule.getOwner(createdUserSA.address));
	// 	console.log('SA address: ', createdUserSA.address);
	// 	return createdUserSA;
	// }

	//deploy forward flow module and enable it in the smart account
	const deploymentsDetup = deployments.createFixture(async ({deployments}) => {
		await deployments.fixture();
		const [deployer, smartAccountOwner, alice, sessionKey, charlie, bob, verifiedSigner, refundReceiver, nonAuthSessionKey] =
			await hardhatEthers.getSigners();

		console.log('deployer: ',await deployer.getAddress());
		console.log('smartAccountOwner: ',await smartAccountOwner.getAddress());
		console.log('alice: ',await alice.getAddress());
		console.log('sessionKey: ',await sessionKey.getAddress());
		console.log('charlie: ',await charlie.getAddress());
		console.log('bob: ',await bob.getAddress());
		
		const ecdsaModule = await getEcdsaOwnershipRegistryModule();
		const entryPoint = await getEntryPoint();

		const EcdsaOwnershipRegistryModule = await hardhatEthers.getContractFactory('EcdsaOwnershipRegistryModule');
		const ownerAddress = await smartAccountOwner.getAddress();
		let ecdsaOwnershipSetupData = EcdsaOwnershipRegistryModule.interface.encodeFunctionData('initForSmartAccount', [ownerAddress]);

		const smartAccountDeploymentIndex = 20;
		const userSA = await getSmartAccountWithModule(ecdsaModule.address, ecdsaOwnershipSetupData, smartAccountDeploymentIndex);
		await new Promise((f) => setTimeout(f, 30000));
		console.log('SA owner: ', await ecdsaModule.getOwner(userSA.address));
		console.log('SA address: ', userSA.address);

		await deployer.sendTransaction({
			to: userSA.address,
			value: ethers.utils.parseEther('0.01'),
		});

		console.log('1 deployed smart account');
		await new Promise((f) => setTimeout(f, 10000));
		const sessionKeyManager = await (await hardhatEthers.getContractFactory('SessionKeyManager')).deploy();
		console.log('2 deployed session keys manager');
		console.log("SKey manager", sessionKeyManager.address);
		await new Promise((f) => setTimeout(f, 10000));
		const smartAccountAddress = await userSA.address;

		let userOp = await makeEcdsaModuleUserOp(
			'enableModule',
			[sessionKeyManager.address],
			smartAccountAddress,
			smartAccountOwner,
			entryPoint,
			ecdsaModule.address
		);

		await new Promise((f) => setTimeout(f, 10000));
		await entryPoint.handleOps([userOp], alice.address);

		console.log('✨ created userOp');

		await new Promise((f) => setTimeout(f, 10000));
		// 3. deploy validation module
		const vvaSessionModule = await(await hardhatEthers.getContractFactory('VVASessionValidationModule')).deploy(
			'0xa5ccb95f10e63bd84cef8f0a5556652c'
		);
		console.log('3 deployed Validation Module');
		console.log("VVA session module", vvaSessionModule.address);

		await new Promise((f) => setTimeout(f, 10000));
		
		const { sessionKeyMockup, groupId, sismoConnectResponse } = await getMockVVASessionKeyData();
		// console.log("ValidationModuleAddress", vvaSessionModule.address)
		const {sessionKeyData, leafData} = await getVVASessionKeyParams(
			smartAccountOwner.address,
			groupId,
			sismoConnectResponse,
			0,
			0,
			vvaSessionModule.address
		);
		// await new Promise((f) => setTimeout(f, 10000));
		// const sessionKeyManager = (await hardhatEthers.getContractFactory('SessionKeyManager')).attach("0x5B19B6DCa5abd3eC2886f477555A7EAA122f039E");

		const merkleTree = await enableNewTreeForSmartAccountViaEcdsa(
			[ethers.utils.keccak256(leafData)],
			sessionKeyManager,
			userSA.address,
			smartAccountOwner,
			entryPoint,
			ecdsaModule.address
		);
		console.log('4 Enabled New Merkel Tree For SmartAccount Via Ecdsa');

		// await new Promise((f) => setTimeout(f, 30000));

		const transferUserOp = await makeEcdsaSessionKeySignedUserOp(
			"executeCall",
			[
			  alice.address,
			  ethers.utils.parseEther("0.00001"),
			  "0x"
			],
			userSA.address,
			smartAccountOwner,
			entryPoint,
			sessionKeyManager.address,
			0, 
			0,
			vvaSessionModule.address,
			sessionKeyData,
			merkleTree.getHexProof(ethers.utils.keccak256(leafData)),
		  );
	
		  await entryPoint.handleOps([transferUserOp], alice.address, {gasLimit: 10000000});

		// return {
		// 	entryPoint: entryPoint,
		// 	smartAccountImplementation: await getSmartAccountImplementation(),
		// 	smartAccountFactory: await getSmartAccountFactory(),
		// 	ecdsaModule: ecdsaModule,
		// 	userSA: userSA,
		// 	mockToken: mockToken,
		// 	verifyingPaymaster: await getVerifyingPaymaster(deployer, verifiedSigner),
		// 	sessionKeyManager: sessionKeyManager,
		// 	vvaSessionModule: vvaSessionModule,
		// 	sessionKeyData: sessionKeyData,
		// 	leafData: leafData,
		// 	merkleTree: merkleTree,
		// };
	});

	// const {entryPoint, userSA: createdUserSA, sessionKeyManager, vvaSessionModule, sessionKeyData, leafData, merkleTree, mockToken} = await deploymentsDetup();
	deploymentsDetup().then(() => {
		console.log('✅ done');
	});

	// 3. deploy validation module
	// white list Arsenii
	// Arsenii triggers a transaction through the SA

	// trigger transaction

	// createTransaction();
}

index().then(() => {
	console.log("finished 🏁")
})