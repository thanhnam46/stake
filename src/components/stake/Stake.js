import './Stake.css'
import { useState } from 'react'
import Web3 from "web3/dist/web3.min"
import BigNumber from "bignumber.js";
import FestakedWithReward from '../../artifacts/contracts/FestakedWithReward.sol/FestakedWithReward.json'
import tokenContract from '../../artifacts/contracts/tokenContract/tokenContract.json'
import MessageBoard from '../overlayMessageBoard/messageBoard'

// const stakingContractAddr = '0x1FE470E4E533EeA525b2f2c34a9EbB995597C143'
const stakingContractAddr = '0xa49403Be3806eb19F27163D396f8A77b40b75C5f'


function Stake(props) {
  const [account, setAccount] = useState('0x0000000000000000000000000000000000000000')
  connectMM()
  async function connectMM() {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }, (error) => {
      if (error) {
        console.log(error)
      }
    });
    setAccount(accounts[0])
  }

  window.ethereum.on('accountsChanged', async () => {
    setAccount(window.ethereum.selectedAddress)
  });


  //check chain
  let chain = ''
  if (window.ethereum.networkVersion === '97') {
    chain = 'You are connected to BSC tesnet'
  } else {
    chain = 'Please connect your Wallet to BSC tesnet!!!'
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
  })


  //Work with staking contract
  const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545/')
  web3.eth.setProvider(Web3.givenProvider); //chuyen sang MM provider, neu khong se gap loi Returned error: unknown account
  const stakingContract = new web3.eth.Contract(FestakedWithReward.abi, stakingContractAddr)

  // Your staked balance
  const [yourStakedBalance, setYourStakedBalance] = useState('')
  async function getYourStakedBalance() {
    await stakingContract.methods.stakeOf(account).call((error, result) => {
      setYourStakedBalance((result / 1e18).toLocaleString('en-EN'))
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

  // Early Withdraw open
  const [earlyWithdraw, setEarlyWithdraw] = useState('')
  stakingContract.methods.withdrawStarts().call((error, result) => {
    // setEarlyWithdraw(new Date(result * 1000).toLocaleString())
    setEarlyWithdraw(result)
  })

  // Stake
  // Control token contract 
  const [txHash, setTxHash] = useState('')
  const tokenAddr = '0x476f7BcbC4058d4a0E8C0f9a6Df1fdcF675FAC83'
  const tokenNPO = new web3.eth.Contract(tokenContract.abi, tokenAddr)

  // show/hide message
  const [messageVisibility, setMessageVisibility] = useState(false)
  const [message, setMessage] = useState('')

  async function stakeToken() {
    let amount = await document.querySelector('.amount').value
    document.querySelector('.failed').style.display = 'none';
    document.querySelector('.success').style.display = 'none';

    // Balance
    const balance = await tokenNPO.methods.balanceOf(account).call()

    //Step 1: Call the NPO token contract & approve the amount contract (to Set Allowance)
    if (amount === '' || amount < 0) {
      alert('Please input a positive amount') //user has to input amount before click on stake button
      setMessageVisibility(false)
    } else if (amount > balance / 1e18) {
      alert('Not enough NPO balance') // check wallet balance
    } else if (stakingCap == stakedBalance) {
      alert('Pool was fulfilled, please stake into another pool!') // check if pool was fulfilled
    } else {
      setMessageVisibility(true)
      setMessage('Waiting for ALLOWANCE confirmation, please confirm it on your Metamask extension!')

      //handle amount (number bigint)
      amount = BigNumber(amount * 1e18).toFixed(0)
      console.log(amount)

      await tokenNPO.methods.approve(stakingContractAddr, amount).send({ from: account },)
        .on('transactionHash', function (hash) {
          console.log(`Set allowance onTransactionHash ${hash}`)
          setMessage('Setting ALLOWANCE, please wait...!')
        })
        .on('receipt', function (receipt) {
          console.log(receipt);
          setMessage('Waiting for STAKING confirmation, please confirm it on your Metamask extension')

          stakingContract.methods.stake(amount).send({ from: account })
            .on('transactionHash', function (hash) {
              console.log(`Staking onTransactionHash ${hash}`)
              setMessage('Confirming, please wait...!')
            })
            .on('confirmation', function (confirmationNumber, receipt) {
              console.log(`onConfirmation ${confirmationNumber}`)
            })
            .on('receipt', function (receipt) {
              console.log(receipt);
              setTxHash(receipt.transactionHash)

              //Show success message
              setMessageVisibility(false)
              document.querySelector('.failed').style.display = 'none';
              document.querySelector('.success').style.display = 'block';
            })
            .on('error', function (error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
              console.log(`onError ${error}`);

              //Show failed message
              document.querySelector('.success').style.display = 'none';
              document.querySelector('.failed').style.display = 'block';
              setMessageVisibility(false)
              setTxHash(receipt.transactionHash)

            });
        })
        .on('error', function (error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
          console.log(`onError ${error}`);
          console.log(receipt);
          setMessageVisibility(false)
          setTxHash(receipt.transactionHash)

        });
    }
  }

  async function unStakeToken() {
    let amount = await document.querySelector('.amount').value
    document.querySelector('.failed').style.display = 'none';
    document.querySelector('.success').style.display = 'none';

    if (amount === '' || amount < 0) {
      alert('Please input a positive amount number') //user has to input amount before click on stake button
      setMessageVisibility(false)
    } else if (amount > yourStakedBalance) {
      alert('You could not withdraw more than what you staked')
    } else if (Date.now() < earlyWithdraw * 1000) {
      alert(`Could not withdraw, you can withdraw from  ${new Date(earlyWithdraw * 1000).toLocaleString()}`)
    } else {
      setMessageVisibility(true)
      //handle amount (number bigint)
      amount = BigNumber(amount * 1e18).toFixed(0)
      setMessage('Waiting for WITHDRAW confirmation, please confirm it on your Metamask extension')


      await stakingContract.methods.withdraw(amount).send({ from: account })
        .on('transactionHash', function (txHash) {
          setMessage('Processing, please wait...!')

        })
        .on('receipt', function (receipt) {
          setTxHash(receipt.transactionHash)

          //Show success message
          setMessageVisibility(false)
          document.querySelector('.failed').style.display = 'none';
          document.querySelector('.success').style.display = 'block';
        })
        .on('error', function (error, receipt) {
          console.log(error)
          setMessageVisibility(false)
          setTxHash(receipt.transactionHash)
          setStakedBalance(() => {
            stakingContract.methods.stakeOf(account).call((error, result) => {
              setYourStakedBalance((result / 1e18).toLocaleString('en-EN'))
            })
          })
        })
    }
  }
  return (
    <div className='content'>
      {messageVisibility && <MessageBoard message={message} />}
      <div className='stakeBox'>
        <p><span className='boldText'>{poolName}</span></p>
        <p>{chain}</p>
        <p><span className='boldText'>YOUR ADDRESS</span></p>
        <p>{account}</p>
        <p><span className='boldText'>CONTRACT ADDRESS</span></p>
        <p>{stakingContractAddr}</p>
        <input className='amount' placeholder='Please input the amount...' type='number' min={0} />
        <div className='btns'>
          <a href='#' className='btn' onClick={stakeToken}>Stake</a>
          <a href='#' className='btn' onClick={unStakeToken}>UnStake</a>
        </div>
      </div>
      <div className='message'>
        <p className='failed'>Stake failed: <a href={'https://testnet.bscscan.com/tx/' + txHash} target="_blank">Click here for detail</a></p>
        <p className='success'>Stake successfully: <a href={'https://testnet.bscscan.com/tx/' + txHash} target="_blank">Click here for detail</a></p>
      </div>
    </div>
  );
}
export default Stake;
