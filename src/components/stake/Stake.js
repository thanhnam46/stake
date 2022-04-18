import './Stake.css'
import { useState } from 'react'
import Web3 from "web3/dist/web3.min"
import FestakedWithReward from '../../artifacts/contracts/FestakedWithReward.sol/FestakedWithReward.json'
import tokenContract from '../../artifacts/contracts/tokenContract/tokenContract.json'

const stakingContractAddr = '0x1FE470E4E533EeA525b2f2c34a9EbB995597C143'

function Stake() {
  const [account, setAccount] = useState('0x0000000000000000000000000000000000000000')

  connectMM()
  async function connectMM() {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
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
  })


  //Work with staking contract
  const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545/')
  web3.eth.setProvider(Web3.givenProvider); //chuyen sang MM provider, neu khong se gap loi Returned error: unknown account
  const stakingContract = new web3.eth.Contract(FestakedWithReward.abi, stakingContractAddr)

  // Pool Name
  const [poolName, setPoolName] = useState('')
  stakingContract.methods.name().call((error, result) => {
    setPoolName(result)
  })

  // Stake
  const [txHash, setTxHash] = useState('')
  const tokenAddr = '0x476f7BcbC4058d4a0E8C0f9a6Df1fdcF675FAC83'
  const tokenNPO = new web3.eth.Contract(tokenContract.abi, tokenAddr)

  async function stakeToken() {
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
    <div className='content'>
      <div className='stakeBox'>
        <p><span className='boldText'>{poolName}</span></p>
        <p>{chain}</p>
        <p><span className='boldText'>YOUR ADDRESS</span></p>
        <p>{account}</p>
        <p><span className='boldText'>CONTRACT ADDRESS</span></p>
        <p>{stakingContractAddr}</p>
        <input className='amount' placeholder='Please input the stake amount...' />
        <a href='#' className='btn stakeBtn' onClick={stakeToken}>Stake</a>
      </div>
      <div className='message'>
        <p className='failed'>Stake failed: <a href={'https://testnet.bscscan.com/tx/' + txHash} target="_blank">Click here for detail</a></p>
        <p className='success'>Stake successfully: <a href={'https://testnet.bscscan.com/tx/' + txHash} target="_blank">Click here for detail</a></p>
      </div>
    </div>
  );
}
export default Stake;
