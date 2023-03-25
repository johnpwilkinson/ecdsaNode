const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak")
const { toHex } = require("ethereum-cryptography/utils")

function verify(signature, message, recoveryBit){
    let signaturePubKey = secp.recoverPublicKey(message, signature, recoveryBit)
    signaturePubKey = keccak256(signaturePubKey.slice(1)).slice(-20)
    return toHex(signaturePubKey)
}    
function createUintArray(obj){
    let ans = new Uint8Array(Object.values(obj[0]))
    return ans
}

module.exports = {
    verify,
    createUintArray
}
