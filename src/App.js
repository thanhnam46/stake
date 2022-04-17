import './App.css'
import { useState, useEffect } from 'react'
import Web3 from "web3/dist/web3.min"
import FestakedWithReward from './artifacts/contracts/FestakedWithReward.sol/FestakedWithReward.json'

const stakingContractAddr = '0x1FE470E4E533EeA525b2f2c34a9EbB995597C143'

function App() {
  const [account, setAccount] = useState('0x0000000000000000000000000000000000000000')
  const [yourStakedBalance, setYourStakedBalance] = useState('')


  async function connectMM() {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(() => {
      return accounts[0]
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
  web3.eth.setProvider(Web3.givenProvider); //chuyen sang MM provider, neu khong se gap loi Returned error: unknown account
  const contract = new web3.eth.Contract(FestakedWithReward.abi, stakingContractAddr)



  // Your staked balance
  contract.methods.stakeOf(account).call((error, result) => {
    setYourStakedBalance(result)
  })

  // Pool Name
  const [poolName, setPoolName] = useState('')
  contract.methods.name().call((error, result) => {
    setPoolName(result)
  })

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

  // Stake
  async function stake() {
    connectMM()
    const amount = await document.querySelector('.amount').value
    if (amount === '') {
      alert('Please input amount')
    } else {
      await contract.methods.stake(parseInt(amount)).send({ from: account }, (error, hash) => {
        if (error) {
          console.log(error)
        } else {
          console.log(hash)
        }
      })
    }
  }

  return (
    <div className="App">
      <header className='header'>
        <img className='logo' src='https://imgur.com/Qxw1soD.jpeg' alt='logo'></img>
        <a href='#' className='links'>Transaction</a>
        <a href='#' className='links'>Staking Options</a>
        <a href='#' className='btn connectWalletBtn links' onClick={connectMM}>Connect Wallet</a>
        <div className='disconnect' onClick={disconnect}>
          <a href='#' className='btn links'>Disconnect ${account}</a>
        </div>
      </header>
      <div className='container'>
        <div className='content'>
          <div className='stakeBox'>
            <p><span className='boldText'>{poolName}</span></p>
            <p>{chain}</p>
            <p><span className='boldText'>YOUR ADDRESS</span></p>
            <p>{account}</p>
            <p><span className='boldText'>CONTRACT ADDRESS</span></p>
            <p>{stakingContractAddr}</p>
            <input className='amount' />
            <a href='#' className='btn' onClick={stake}>Stake</a>
          </div>
          <div className='poolInfor'>
            <ul>
              <li>Your staked balance <span className='boldText'>{yourStakedBalance} </span></li>
              <li>Staking cap <span className='boldText'>{stakingCap} NPO</span> </li>
              <li>Staked so far <span className='boldText'>{stakedBalance}</span></li>
              <li>Maturity reward <span className='boldText'>30% APR</span></li>
              <li>Early rewards <span className='boldText'>8% APR</span> </li>
              <li>Contribution close <span className='boldText'>{stakingEnds}</span></li>
              <li>Early withdraw open <span className='boldText'>{earlyWithdraw}</span></li>
              <li>Maturity at <span className='boldText'>{maturityAt}</span></li>
            </ul>
          </div>
        </div>
      </div >
    </div >
  );
}

export default App;
