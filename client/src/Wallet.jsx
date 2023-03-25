import { abbreviateAddress } from './helpers'

function Wallet({ address, setAddress, balance, setBalance, setPrivateKey, user, setUser, wallets }) {

    async function onSelectUser(evt) {
        const selectedUser = evt.target.value;
        let details = await getUserDetails(selectedUser)
        setPrivateKey(details.privateKey)
        setAddress(details.pubKey)
        setUser(details.name)
        setBalance(details.balance)
    }

    async function getUserDetails(userName){
        for(let i = 0; i < wallets.length; i++){
            if(wallets[i].name === userName){
                return wallets[i]
            }
        }
    }

    return (
        <div className="container wallet">
            <h1>Your Wallet</h1>
            <label>
            Wallet Address
                <select onChange={onSelectUser} >
                <option value="">--- please choose a user wallet ---</option>
                    {wallets && wallets.map((el, i) => (
                        <option key={i} value={el.name}>
                        {el.name}
                        </option>
                    ))}
                </select>
            </label>
            {user &&
                <div>
                    <div className="balance">Name: {user}</div>
                    <div className="balance">Address: {abbreviateAddress(address)}</div>
                    <div className="balance">Balance: {balance}</div>
                </div>
            }
        </div>
    );
}

export default Wallet;
