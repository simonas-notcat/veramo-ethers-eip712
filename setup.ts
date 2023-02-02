import { createAgent, IKeyManager, IDIDManager, ICredentialIssuer } from '@veramo/core'
import { CredentialIssuerEIP712 } from '@veramo/credential-eip712';
import { CredentialPlugin } from '@veramo/credential-w3c';
import { DIDManager, MemoryDIDStore } from '@veramo/did-manager';
import { getDidPkhResolver, PkhDIDProvider } from '@veramo/did-provider-pkh';
import { KeyManager, MemoryKeyStore } from '@veramo/key-manager';
import { Web3KeyManagementSystem } from '@veramo/kms-web3';
import { DIDResolverPlugin } from '@veramo/did-resolver';
import { createEthersProvider } from "./ethers-provider.js";

const ethersProvider = createEthersProvider()

export const veramo = createAgent<IKeyManager & IDIDManager & ICredentialIssuer>({
  plugins: [
    new DIDResolverPlugin({
      ...getDidPkhResolver(),
    }),
    new KeyManager({
      store: new MemoryKeyStore(),
      kms: {
        web3: new Web3KeyManagementSystem({
          ethers: ethersProvider,
        }),
      },
    }),
    new DIDManager({
      store: new MemoryDIDStore(),
      defaultProvider: 'did:pkh',
      providers: {
        'did:pkh': new PkhDIDProvider({
          defaultKms: 'web3',
        }),
      }
    }),
    new CredentialIssuerEIP712(),
    new CredentialPlugin()
  ]
})