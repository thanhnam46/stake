import './App.css'
import { useState } from 'react'
import Web3 from "web3/dist/web3.min"
import FestakedWithReward from './artifacts/contracts/FestakedWithReward.sol/FestakedWithReward.json'
import tokenContract from './artifacts/contracts/tokenContract/tokenContract.json'

const stakingContractAddr = '0x1FE470E4E533EeA525b2f2c34a9EbB995597C143'

function App() {
  const [account, setAccount] = useState('0x0000000000000000000000000000000000000000')
  connectMM()
  async function connectMM() {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0])

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

  //Work with staking contract
  const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545/')
  web3.eth.setProvider(Web3.givenProvider); //chuyen sang MM provider, neu khong se gap loi Returned error: unknown account
  const stakingContract = new web3.eth.Contract(FestakedWithReward.abi, stakingContractAddr)



  // Your staked balance
  const [yourStakedBalance, setYourStakedBalance] = useState('')
  async function getYourStakedBalance() {
    await stakingContract.methods.stakeOf(account).call((error, result) => {
      setYourStakedBalance(result / 1e18)
    })
  }
  getYourStakedBalance()

  // Pool Name
  const [poolName, setPoolName] = useState('')
  stakingContract.methods.name().call((error, result) => {
    setPoolName(result)
  })

  // Get staking cap
  const [stakingCap, setStakingCap] = useState('')
  stakingContract.methods.stakingCap().call((error, result) => {
    setStakingCap(result / 1e18)
  })

  // Staked so far
  const [stakedBalance, setStakedBalance] = useState('')
  stakingContract.methods.stakedBalance().call((error, result) => {
    setStakedBalance(result / 1e18)
  })

  // Staking start
  const [stakingStart, setstakingStart] = useState('')
  stakingContract.methods.stakingStarts().call((error, result) => {
    setstakingStart(new Date(result * 1000).toLocaleString())
  })

  // Contribution close
  const [stakingEnds, setstakingEnds] = useState('')
  stakingContract.methods.stakingEnds().call((error, result) => {
    setstakingEnds(new Date(result * 1000).toLocaleString())
  })

  // Early Withdraw open
  const [earlyWithdraw, setEarlyWithdraw] = useState('')
  stakingContract.methods.withdrawStarts().call((error, result) => {
    setEarlyWithdraw(new Date(result * 1000).toLocaleString())
  })

  // Maturity at
  const [maturityAt, setMaturityAt] = useState('')
  stakingContract.methods.withdrawEnds().call((error, result) => {
    setMaturityAt(new Date(result * 1000).toLocaleString())
  })

  // Stake
  const [txHash, setTxHash] = useState('')
  const tokenAddr = '0x476f7BcbC4058d4a0E8C0f9a6Df1fdcF675FAC83'
  const tokenNPO = new web3.eth.Contract(tokenContract.abi, tokenAddr)

  async function stake() {
    let amount = await document.querySelector('.amount').value

    //Step 1: Call the NPO token contract & approve the amount contract (to Set Allowance)
    if (amount === '') {
      alert('Please input amount')
    } else {
      amount = (amount * 1e18).toString()
      await tokenNPO.methods.approve(stakingContractAddr, amount).send({ from: account },)
        .on('transactionHash', function (hash) {
          console.log(`Set allowance onTransactionHash ${hash}`)
        })
        .on('receipt', function (receipt) {
          console.log(receipt);
          stakingContract.methods.stake(amount).send({ from: account })
            .on('transactionHash', function (hash) {
              console.log(`Staking onTransactionHash ${hash}`)
            })
            .on('confirmation', function (confirmationNumber, receipt) {
              console.log(`onConfirmation ${confirmationNumber}`)
            })
            .on('receipt', function (receipt) {
              console.log(receipt);
              setTxHash(receipt.transactionHash)

              //Show success message
              document.querySelector('.failed').style.display = 'none';
              document.querySelector('.success').style.display = 'block';
            })
            .on('error', function (error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
              console.log(`onError ${error}`);

              //Show failed message
              document.querySelector('.success').style.display = 'none';
              document.querySelector('.failed').style.display = 'block';
            });
        })
        .on('error', function (error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
          console.log(`onError ${error}`);
          console.log(receipt);
        });
    }
  }

  return (
    <div className="App">
      <header className='header'>
        <img className='logo' src='https://imgur.com/Qxw1soD.jpeg' alt='logo'></img>
        <a href='https://testnet.bscscan.com/address/0x1FE470E4E533EeA525b2f2c34a9EbB995597C143#tokentxns' className='links'>Transaction</a>
        <a href='https://staking.spores.app' className='links'>Staking Options</a>
        <a href='#' className='btn connectWalletBtn links' onClick={connectMM}>Connect Wallet</a>
        <div className='disconnect' onClick={disconnect}>
          <a href='#' className='btn links'>Disconnect {account}</a>
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
            <input className='amount' placeholder='Please input the stake amount...' />
            <a href='#' className='btn stakeBtn' onClick={stake}>Stake</a>
          </div>
          <div className='poolInfor'>
            <ul>
              <li>Your staked balance <span className='boldText'>{yourStakedBalance} NPO </span></li>
              <li>Staking cap <span className='boldText'>{stakingCap} NPO</span> </li>
              <li>Staked so far <span className='boldText'>{stakedBalance} NPO</span></li>
              <li>Maturity reward <span className='boldText'>30% APR</span></li>
              <li>Early rewards <span className='boldText'>8% APR</span> </li>
              <li>Staking starts <span className='boldText'>{stakingStart}</span></li>
              <li>Contribution close <span className='boldText'>{stakingEnds}</span></li>
              <li>Early withdraw open <span className='boldText'>{earlyWithdraw}</span></li>
              <li>Maturity at <span className='boldText'>{maturityAt}</span></li>
            </ul>
          </div>

        </div>
        <p className='success'>Stake successfully, txHash <a href={'https://testnet.bscscan.com/tx/' + txHash} target="_blank">{txHash}</a></p>
        <p className='failed'>Stake failed, txHash <a href={'https://testnet.bscscan.com/tx/' + txHash} target="_blank">{txHash}</a></p>
      </div >
    </div >
  );
}

export default App;
