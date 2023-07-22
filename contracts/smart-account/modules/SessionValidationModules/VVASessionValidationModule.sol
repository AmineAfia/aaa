// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
import "./ISessionValidationModule.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@sismo-core/sismo-connect-solidity/contracts/libs/SismoLib.sol";

contract VVASessionValidationModule is SismoConnect {
    // call SismoConnect constructor with your appId
    constructor(bytes16 appId) SismoConnect(buildConfig(appId)) {}

    /**
     * @dev validates if the _op (UserOperation) matches the SessionKey permissions
     * and that _op has been signed by this SessionKey
     * @param _op User Operation to be validated.
     * @param _userOpHash Hash of the User Operation to be validated.
     * @param _sessionKeyData SessionKey data, that describes sessionKey permissions
     * @param _sessionKeySignature Signature over the the _userOpHash.
     * @return true if the _op is valid, false otherwise.
     */
    function validateSessionUserOp(
        UserOperation calldata _op,
        bytes32 _userOpHash,
        bytes calldata _sessionKeyData,
        bytes calldata _sessionKeySignature
    ) external view returns (bool) {
        // public key of the user [20 bytes]
        address sessionKey = address(bytes20(_sessionKeyData[0:20]));

        // sismo groupId [16 bytes]
        bytes16 groupId = bytes16(_sessionKeyData[20:36]);

        // everything we get from sismo proof of the user
        bytes memory sismoConnectResponse = _sessionKeyData[36:]; // TODO check the slicing

        SismoConnectResponse memory response = abi.decode(
            sismoConnectResponse,
            (SismoConnectResponse)
        );
        SismoConnectRequest memory request = buildRequest(
            buildAuth({authType: AuthType.VAULT}),
            buildClaim({groupId: groupId}),
            buildSignature({message: abi.encode(sessionKey)})
        ); // TODO correct to use sessionKey?

        try _sismoConnectVerifier.verify(response, request, config()) returns (
            SismoConnectVerifiedResult memory result
        ) {
            // if the proofs and signed message are valid, we can take the vaultId from the verified result
            // it is the anonymous identifier of a user's vault for our VVA app
            // --> vaultId = hash(userVaultSecret, appId)
            uint256 vaultId = SismoConnectHelper.getUserId(
                result,
                AuthType.VAULT
            );

            // [OPTIONAL] TODO we can check for additional proofs?

            // check that signature is corresponding to the public key
            return
                ECDSA.recover(
                    ECDSA.toEthSignedMessageHash(_userOpHash),
                    _sessionKeySignature
                ) == sessionKey;
        } catch {
            return false;
        }
    }
}
