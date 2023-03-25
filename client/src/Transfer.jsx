import { useState } from "react";
import server from "./server";
import * as secp from 'ethereum-cryptography/secp256k1'
import { toHex } from 'ethereum-cryptography/utils'
import { utf8ToBytes, hexToBytes } from 'ethereum-cryptography/utils'
import { keccak256 } from 'ethereum-cryptography/keccak'
import { abbreviateAddress } from "./helpers";

function Transfer({ address, setBalance, setWallets, wallets, user }) {
    const [sendAmount, setSendAmount] = useState("");
    const [recipient, setRecipient] = useState("");

    const setValue = (setter) => (evt) => setter(evt.target.value);

    async function hashMessage(message){
        return toHex(keccak256(utf8ToBytes(message)))
    }
    async function onSelectUser(evt) {
        const selectedUser = evt.target.value;
        let details = await getUserDetails(selectedUser)
        setRecipient(details.pubKey)

        }
    async function getUserDetails(userName){
        for(let i = 0; i < wallets.length; i++){
            if(wallets[i].name === userName){
                return wallets[i]
            }
        }
    }   
    async function getSignature(e){
        e.preventDefault()
        const pk = prompt(`enter private key for ${address}`)
        try {
            let data = {
                recipient,
                amount: parseInt(sendAmount)
            }
            let msgHex = await hashMessage(JSON.stringify(data))
            let signature = await secp.sign(msgHex, pk, {recovered: true})
            await transfer(signature)
        } catch(ex) {
            alert(ex)
        } 
    }
    async function transfer(signature) {
        try {
            const {
                data: {balance},
            } = await server.post(`send`, {
                sender: address,
                amount: parseInt(sendAmount),
                recipient,
                signature: signature
            })
            setWallets(balance)
            for(let i = 0; i < balance.length; i++){
                if(balance[i].pubKey === address){
                    setBalance(balance[i].balance)
                }}
            alert('Transaction Completed')
        }catch(e){
            alert(e.response.data.message)
        }
    }
    return (
        <form className="container transfer" onSubmit={getSignature}>
            <h1>Send Transaction</h1>
            <label>
            Send Amount
                <input
                    placeholder="1, 2, 3..."
                    value={sendAmount}
                    onChange={setValue(setSendAmount)}
                ></input>
            </label>
            <label>
            Recipient
            <select onChange={onSelectUser} >
                    <option value="">--- please choose a user wallet ---</option>
                        {wallets && wallets.map((el, i) => {
                            if(el.name !== user){
                                return(
                                <option key={i} value={el.name}>
                                    {el.name}--{abbreviateAddress(el.pubKey)}
                                </option>
                                )
                            }
                        })}
                    </select>
            </label>
            <input type="submit" className="button" value="Transfer" />
        </form>);
}

export default Transfer;
