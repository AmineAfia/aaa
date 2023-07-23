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

        SismoConnectResponse memory response = abi.decode(
            _sessionKeyData[36:],
            (SismoConnectResponse)
        );
        // we want users to prove that they own a Sismo Vault
        // and that they are members of the group with the groupId passed from the FE in the sessionKeyData
        // we are recreating the auth and claim requests made in the frontend to be sure that
        // the proofs provided in the response are valid with respect to this auth request
        AuthRequest[] memory auths = new AuthRequest[](2);
        auths[0] = buildAuth({authType: AuthType.VAULT});
        auths[1] = buildAuth({authType: AuthType.EVM_ACCOUNT});

        ClaimRequest[] memory claims = new ClaimRequest[](1);
        claims[0] = buildClaim({groupId: groupId});

        SismoConnectRequest memory request = buildRequest(
            auths,
            claims,
            buildSignature({message: abi.encode(sessionKey)})
        );

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
