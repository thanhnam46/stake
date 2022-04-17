import './App.css'
import { useState } from 'react'
import Web3 from "web3/dist/web3.min"
import FestakedWithReward from './artifacts/contracts/FestakedWithReward.sol/FestakedWithReward.json'

const stakingContractAddr = '0xbE7E299bB3c2c3B0e436A54935365B9aFF26EB04'

function App() {
  const [account, setAccount] = useState('')
  const [yourStakedBalance, setYourStakedBalance] = useState('')


  async function connectMM() {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(() => {
      return accounts[0]
    })

    // Your staked balance
    contract.methods.stakeOf(account).call((error, result) => {
      setYourStakedBalance(result)
    })

    //Change the UI
    document.querySelector('.disconnect').style.display = 'block';
    document.querySelector('.connectWalletBtn').style.display = 'none';
  }

  function disconnect() {
    document.querySelector('.disconnect').style.display = 'none';
    document.querySelector('.connectWalletBtn').style.display = 'block';
  }

  window.ethereum.on('accountsChanged', async () => {
    setAccount(window.ethereum.selectedAddress)
  });

  //check chain
  let chain = ''
  if (window.ethereum.networkVersion === '97') {
    chain = 'You are connected to BSC tesnet'
  } else {
    chain = 'Please connect to BSC tesnet!!!'
  }

  window.ethereum.on('chainChanged', (chainID) => {
    // Handle the new chain.
    // Correctly handling chain changes can be complicated.
    // We recommend reloading the page unless you have good reason not to.
    if (parseInt(chainID).toString === '97') {
      chain = 'You are connected to BSC tesnet'
    } else {
      chain = 'Please connect to BSC tesnet!!!'
    }
    window.location.reload();
  });

  //Work with contract
  const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545/')
  web3.setProvider(new web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545/'))
  const contract = new web3.eth.Contract(FestakedWithReward.abi, stakingContractAddr)

  // Get staking cap
  const [stakingCap, setStakingCap] = useState('')
  contract.methods.stakingCap().call((error, result) => {
    setStakingCap(result / 10e18)
  })

  // Staked so far
  const [stakedBalance, setStakedBalance] = useState('')
  contract.methods.stakedBalance().call((error, result) => {
    setStakedBalance(result)
  })

  // Contribution close
  const [stakingEnds, setstakingEnds] = useState('')
  contract.methods.stakingEnds().call((error, result) => {
    setstakingEnds(new Date(result * 1000).toLocaleString())
  })

  // Early Withdraw open
  const [earlyWithdraw, setEarlyWithdraw] = useState('')
  contract.methods.withdrawStarts().call((error, result) => {
    setEarlyWithdraw(new Date(result * 1000).toLocaleString())
  })

  // Maturity at
  const [maturityAt, setMaturityAt] = useState('')
  contract.methods.withdrawEnds().call((error, result) => {
    setMaturityAt(new Date(result * 1000).toLocaleString())
  })
  return (
    <div className="App">
      <header className='header'>
        <img className='logo' src='https://imgur.com/Qxw1soD.jpeg' alt='logo'></img>
        <a href='#' className='links'>Transaction</a>
        <a href='#' className='links'>Staking Options</a>
        <a href='#' className='connectWalletBtn links' onClick={connectMM}>Connect Wallet</a>
        <div className='disconnect' onClick={disconnect}>
          <a href='#' className='disconnectBtn links'>Disconnect ${account}</a>
        </div>
      </header>
      <div className='container'>
        <div className='content'>
          <div className='stakeBox'>
            <p>SPO-BSC Short Term</p>
            <p>{chain}</p>
            <p>YOUR ADDRESS</p>
            <p>{account}</p>
          </div>
          <div className='poolInfor'>
            <ul>
              <li>Your staked balance {yourStakedBalance} </li>
              <li>Staking cap {stakingCap}</li>
              <li>Staked so far {stakedBalance}</li>
              <li>Maturity reward 30% APR</li>
              <li>Early rewards 8% APR</li>
              <li>Staking contribution close {stakingEnds}</li>
              <li>Early withdraw open {earlyWithdraw}</li>
              <li>Maturity at {maturityAt}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
