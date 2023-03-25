import server from "./server";
import Wallet from "./Wallet";
import Transfer from "./Transfer";
import Accounts from "./Accounts";
import "./App.scss";
import { useEffect, useState } from "react";

function App() {
    const [balance, setBalance] = useState(0);
    const [address, setAddress] = useState("");
    const [privateKey, setPrivateKey] = useState("");
    const [wallets, setWallets] = useState([])
    const [user, setUser] = useState("")

    async function getWallets(){
        const res = await server.get("balances")
        for(let i = 0; i < res.data.length; i++){
            console.log(`${res.data[i].name}'s private key is ${res.data[i].privateKey}`)
        }
        setWallets(res.data)
    }

    useEffect(() => {
        getWallets()
    },[])

    return (
        <div className="app">
            <Wallet
            balance={balance}
            privateKey={privateKey}
            setPrivateKey={setPrivateKey}
            setBalance={setBalance}
            address={address}
            setAddress={setAddress}
            wallets={wallets}
            setUser={setUser}
            user={user}
            />
            <Transfer setBalance={setBalance} address={address} setWallets={setWallets}  privateKey={privateKey} getWallets={getWallets} wallets={wallets} user={user} />
            <Accounts wallets={wallets} />
        </div>
    );
}

export default App;
