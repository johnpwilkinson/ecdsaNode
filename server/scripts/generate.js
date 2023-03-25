const secp = require("ethereum-cryptography/secp256k1")
const { toHex } = require("ethereum-cryptography/utils")
const { keccak256 } = require("ethereum-cryptography/keccak");

function generateKeys(){
    const privateKey = secp.utils.randomPrivateKey()
    let publicKey = secp.getPublicKey(privateKey)
    publicKey = keccak256(publicKey.slice(1)).slice(-20)
    return {
        publicKey: toHex(publicKey),
        privateKey: toHex(privateKey)
    } 
}

module.exports = { generateKeys }
