import server from "./server";
import * as secp from 'ethereum-cryptography/secp256k1'
import { toHex } from 'ethereum-cryptography/utils'
import { keccak256 } from 'ethereum-cryptography/keccak'

function Accounts({ wallets }) {


return (
    <div className="container wallet">
      <h1>Accounts</h1>
      <table > 
        <thead>
            <tr>
                <th>User Name</th>
                <th>Public Address</th>
                <th>Balance</th>
            </tr>
        </thead>
        <tbody>
        {wallets && wallets.map((el, i) => (
            <tr style={{textAlign:"center"}} key={i} value={el.name}>
                <td>{el.name}</td>
                <td >{el.pubKey}</td>
                <td>{el.balance}</td>
            </tr>
          ))}
            </tbody>
        </table>
    </div>
  );
}

export default Accounts;
