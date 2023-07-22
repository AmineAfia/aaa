import {config} from 'dotenv';
import {IBundler, Bundler} from '@biconomy/bundler';
import {ChainId} from '@biconomy/core-types';
import {ethers as hardhatEthers, waffle, deployments} from 'hardhat';
import {BiconomySmartAccountConfig, DEFAULT_ENTRYPOINT_ADDRESS} from '@biconomy/account';
import {Wallet, providers, ethers} from 'ethers';
import {makeEcdsaModuleUserOp} from '../test/utils/userOp';
import {
	getEcdsaOwnershipRegistryModule,
	getEntryPoint,
	getMockToken,
	getSmartAccountFactory,
	getSmartAccountImplementation,
	getSmartAccountWithModule,
	getVerifyingPaymaster,
} from '../test/utils/setupHelper';

import {enableNewTreeForSmartAccountViaEcdsa, getERC20SessionKeyParams} from '../test/utils/sessionKey';

config();

// const provider = new providers.JsonRpcProvider('https://rpc.ankr.com/polygon_mumbai');
// const wallet = new Wallet(process.env.PRIVATE_KEY || '', provider);
var userSA: any = {};
const maxAmount = ethers.utils.parseEther('100');
const [deployer, smartAccountOwner, alice, bob, charlie, verifiedSigner, refundReceiver, sessionKey, nonAuthSessionKey] =
	waffle.provider.getWallets();

// const bundler: IBundler = new Bundler({
// 	bundlerUrl: 'https://bundler.biconomy.io/api/v2/80001/abc',
// 	chainId: ChainId.POLYGON_MUMBAI,
// 	entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
// });

async function createAccount() {
	const ecdsaModule = await getEcdsaOwnershipRegistryModule();
	const EcdsaOwnershipRegistryModule = await hardhatEthers.getContractFactory('EcdsaOwnershipRegistryModule');
	const ownerAddress = await smartAccountOwner.getAddress();
	let ecdsaOwnershipSetupData = EcdsaOwnershipRegistryModule.interface.encodeFunctionData('initForSmartAccount', [ownerAddress]);
	
	const smartAccountDeploymentIndex = 0;
	const createdUserSA = await getSmartAccountWithModule(ecdsaModule.address, ecdsaOwnershipSetupData, smartAccountDeploymentIndex);
	console.log('SA owner: ', await ecdsaModule.getOwner(createdUserSA.address));
	console.log('SA address: ', await createdUserSA.address);
	return createdUserSA;
}


//deploy forward flow module and enable it in the smart account	
const deploymentsDetup = deployments.createFixture(async ({deployments, getNamedAccounts}) => {
	await deployments.fixture();
	const ecdsaModule = await getEcdsaOwnershipRegistryModule();
	const entryPoint = await getEntryPoint();

	userSA = await createAccount()
	console.log('1 deployed smart account');

	const sessionKeyManager = await (await hardhatEthers.getContractFactory('SessionKeyManager')).deploy();
	console.log('2 deployed session keys manager');
	
	const smartAccountAddress = await userSA.address;
	
	let userOp = await makeEcdsaModuleUserOp(
		'enableModule',
		[sessionKeyManager.address],
		smartAccountAddress,
		smartAccountOwner,
		entryPoint,
		ecdsaModule.address
	);
	await entryPoint.handleOps([userOp], alice.address);
	console.log('✨ created userOp');

	// 3. deploy validation module
	const erc20SessionModule = await (await hardhatEthers.getContractFactory('ERC20SessionValidationModule')).deploy();
	console.log('3 deployed Validation Module');

	const mockToken = await getMockToken();
	const {sessionKeyData, leafData} = await getERC20SessionKeyParams(
		sessionKey.address,
		mockToken.address,
		charlie.address,
		maxAmount,
		0,
		0,
		erc20SessionModule.address
	);

	const merkleTree = await enableNewTreeForSmartAccountViaEcdsa(
		[ethers.utils.keccak256(leafData)],
		sessionKeyManager,
		userSA.address,
		smartAccountOwner,
		entryPoint,
		ecdsaModule.address
	);
	console.log('4 Enabled New Merkel Tree For SmartAccount Via Ecdsa');

	return {
		entryPoint: entryPoint,
		smartAccountImplementation: await getSmartAccountImplementation(),
		smartAccountFactory: await getSmartAccountFactory(),
		ecdsaModule: ecdsaModule,
		userSA: userSA,
		mockToken: mockToken,
		verifyingPaymaster: await getVerifyingPaymaster(deployer, verifiedSigner),
		sessionKeyManager: sessionKeyManager,
		erc20SessionModule: erc20SessionModule,
		sessionKeyData: sessionKeyData,
		leafData: leafData,
		merkleTree: merkleTree,
	};
});

// const {entryPoint, userSA: createdUserSA, sessionKeyManager, erc20SessionModule, sessionKeyData, leafData, merkleTree, mockToken} = await deploymentsDetup();
deploymentsDetup().then(() => {
	console.log('✅ done')
})


// 3. deploy validation module
// white list Arsenii
// Arsenii triggers a transaction through the SA

// trigger transaction
async function createTransaction() {
	console.log('creating account');

	const transaction = {
		to: '0x14a4CF64e8BdC492D7fAF782896E22C79334b1Fe',
		data: '0x',
		value: ethers.utils.parseEther('0'),
	};

	const userOp = await userSA.buildUserOp([transaction]);
	userOp.paymasterAndData = '0x';

	const userOpResponse = await userSA.sendUserOp(userOp);

	const transactionDetail = await userOpResponse.wait();

	console.log('transaction detail below');
	console.log(transactionDetail);
}

// createTransaction();
