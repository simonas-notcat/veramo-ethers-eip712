import { MinimalImportableKey } from '@veramo/core'
import { veramo } from './setup.js'

const account = `0x71CB05EE1b1F506fF321Da3dac38f25c0c9ce6E1`
const did = `did:pkh:eip155:1:${account}`
const controllerKeyId = `ethers-${account}`

const identifier = await veramo.didManagerImport({
  did,
  provider: 'did:pkh',
  controllerKeyId,
  keys: [
    {
      kid: controllerKeyId,
      type: 'Secp256k1',
      kms: 'web3',
      privateKeyHex: '',
      publicKeyHex: '',
      meta: {
        account,
        provider: 'ethers',
        algorithms: ['eth_signMessage', 'eth_signTypedData'],
      },
    } as MinimalImportableKey,
  ],
})

console.log(JSON.stringify(identifier, null, 2))

const credential = await veramo.createVerifiableCredential({
  credential: {
    issuer: { id: identifier.did },
    credentialSubject: {
      id: identifier.did,
      name: 'Alice'
    }
  },
  proofFormat: 'EthereumEip712Signature2021'
})

console.log(JSON.stringify(credential, null, 2))
