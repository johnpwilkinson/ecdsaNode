const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const {generateKeys} = require("./scripts/generate")
const { toHex } = require("ethereum-cryptography/utils")
const { keccak256 } = require("ethereum-cryptography/keccak")
const { utf8ToBytes } = require("ethereum-cryptography/utils")
const { verify, createUintArray } = require("./scripts/helpers")

app.use(cors());
app.use(express.json());

const balances = {};
const users = ['Alice', 'Bob', 'Carl']
const wallets = []
function genWallets(){
    for(let i = 0; i < 3; i++){
        let pk = generateKeys()
        balances[pk.publicKey] = 300 / (i + 1)
        wallets.push({name: users[i], pubKey: pk.publicKey, privateKey: pk.privateKey, balance: balances[pk.publicKey]})
    }
}
genWallets()

app.get("/balances", (req, res) => {
    res.send(wallets)
})

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] ;
  res.send({ balance });
});

app.post("/send", (req, res) => {
    const { sender, recipient, amount, signature } = req.body;
    const recoveryBit = signature[1]
    let message = JSON.stringify({
        recipient,
        amount
    })
    let propSign = createUintArray(signature)
    message = toHex(keccak256(utf8ToBytes(message)))
    setInitialBalance(sender);
    setInitialBalance(recipient);
    const verifiedSender = verify(propSign, message, recoveryBit)
    if(verifiedSender === sender){
        if (balances[sender] < amount) {
            res.status(400).send({ message: "Not enough funds!" });
        } else {
            balances[sender] -= amount;
            balances[recipient] += amount;
            for(let i = 0; i < wallets.length; i++){
                if(wallets[i].pubKey === sender){
                    wallets[i].balance -= amount
                }else if(wallets[i].pubKey === recipient){
                    wallets[i].balance += amount
                }
            }      
            res.send({ balance: wallets });
        }
    }else{
        res.status(400).send({ message: "Wrong Private Key!" });
    }
  });

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
