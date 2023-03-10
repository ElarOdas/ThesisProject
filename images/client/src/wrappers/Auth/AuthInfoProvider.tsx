import {
    calculatePKCECodeChallenge,
    Client,
    AuthorizationServer,
    discoveryRequest,
    processDiscoveryResponse,
} from 'oauth4webapi';

import AuthServerInfo from '../../model/authServerInfo';
import { VerifierStorage } from './Verifier';

/*
 * AuthInfoProvider wraps the values needed for oauth4webapis Auth Code flow
 */

export default class AuthInfoProvider {
    client: Client;
    code_challenge_method = 'S256';
    info: AuthServerInfo;
    authServer!: AuthorizationServer;
    verifier: VerifierStorage;
    // Load

    // Create Challenge
    async createChallenge() {
        try {
            if (!this.verifier.verifier) {
                throw new Response(
                    JSON.stringify({
                        message: 'No verifier set',
                    }),
                    { status: 400 }
                );
            }
            return calculatePKCECodeChallenge(this.verifier.verifier);
        } catch (error) {
            throw error;
        }
    }

    // Create AuthServer
    async createAuthServer() {
        try {
            const as = await discoveryRequest(this.info.issuer).then(
                (response) =>
                    processDiscoveryResponse(this.info.issuer, response)
            );
            if (
                as.code_challenge_methods_supported?.includes(
                    this.code_challenge_method
                ) !== true
            ) {
                // This example assumes S256 PKCE support is signalled
                // If it isn't supported, random `nonce` must be used for CSRF protection.
                throw new Response(
                    JSON.stringify({
                        message:
                            'S256 not supported. Can not authenticate to Auth Server: ' +
                            this.info.issuer,
                    }),
                    { status: 500 }
                );
            }
            this.authServer = as;
        } catch (error) {
            throw error;
        }
    }

    #createClient(clientId: string) {
        return {
            client_id: clientId,
            token_endpoint_auth_method: 'none',
        } as Client;
    }

    constructor(storageName: string, info: AuthServerInfo) {
        this.verifier = new VerifierStorage(storageName);
        this.info = info;
        this.client = this.#createClient(this.info.clientID);
    }
}
