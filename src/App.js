import './App.css'
import Web3 from "web3/dist/web3.min"
import FestakedWithReward from './artifacts/contracts/FestakedWithReward.sol/FestakedWithReward.json'

const FestakedWithRewardAddress = '0xbE7E299bB3c2c3B0e436A54935365B9aFF26EB04'

function App() {
  const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545"); 

  return (
    <div className="App">
      <header className='header'>
        <img className='logo' src='https://imgur.com/Qxw1soD.jpeg' alt='logo'></img>
        <a href='#' className='links'>Transaction</a>
        <a href='#' className='links'>Staking Options</a>
        <a href='#' className='connectWalletBtn links'>Connect Wallet</a>
      </header>
      <div className='container'>
        <div className='content'>
          <div className='stakeBox'>
            <p>SPO-BSC Short Term</p>
            <p>Connected to BSC network</p>
            <p>YOUR ADDRESS</p>
            <p>{web3.currentProvider.selectedAddress}</p>
          </div>
          <div className='poolInfor'>
            <ul>
              <li>Your staked balance</li>
              <li>Staking cap </li>
              <li>Staked so far</li>
              <li>Maturity reward</li>
              <li>Early rewards</li>
              <li>Staking contribution close</li>
              <li>Early withdraw open</li>
              <li>Maturity at</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
