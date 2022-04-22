import './Stake.css'
import { useState } from 'react'
import BigNumber from "bignumber.js";
import MessageBoard from '../overlayMessageBoard/messageBoard'
import withWallet from '../HOC/hoc'

// const stakingContractAddr = '0x1FE470E4E533EeA525b2f2c34a9EbB995597C143'
const stakingContractAddr = '0xa49403Be3806eb19F27163D396f8A77b40b75C5f'


function Stake(props) {
  // Call from HOC - Reuse functions/code fro Higher Order Component
  props.onAccountChange()

  let setStakedBalance = props.setStakedBalance
  let setYourStakedBalance = props.setYourStakedBalance
  let getyourStakedBalance = props.getyourStakedBalance
  // Stake & Unstake
  const [txHash, setTxHash] = useState('')

  // show/hide message
  const [messageVisibility, setMessageVisibility] = useState(false)
  const [message, setMessage] = useState('')

  async function stakeToken() {
    let amount = await document.querySelector('.amount').value
    document.querySelector('.failed').style.display = 'none';
    document.querySelector('.success').style.display = 'none';

    // Balance
    const balance = await props.tokenNPO.methods.balanceOf(props.account).call()

    //Step 1: Call the NPO token contract & approve the amount contract (to Set Allowance)
    if (amount === '' || amount < 0) {
      alert('Please input a positive amount') //user has to input amount before click on stake button
      setMessageVisibility(false)
    } else if (amount > balance / 1e18) {
      alert('Not enough NPO balance') // check wallet balance
    } else if (props.stakingCap == props.stakedBalance) {
      alert('Pool was fulfilled, please stake into another pool!') // check if pool was fulfilled
    } else {
      setMessageVisibility(true)
      setMessage('Waiting for ALLOWANCE confirmation, please confirm it on your Metamask extension!')

      //handle amount (number bigint)
      amount = BigNumber(amount * 1e18).toFixed(0)
      console.log(amount)

      await props.tokenNPO.methods.approve(stakingContractAddr, props.account).send({ from: props.account },)
        .on('transactionHash', function (hash) {
          console.log(`Set allowance onTransactionHash ${hash}`)
          setMessage('Setting ALLOWANCE, please wait...!')
        })
        .on('receipt', function (receipt) {
          console.log(receipt);
          setMessage('Waiting for STAKING confirmation, please confirm it on your Metamask extension')

          props.stakingContract.methods.stake(props.account).send({ from: props.account })
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
              getyourStakedBalance()
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
    } else if (parseFloat(amount) > parseFloat(props.yourStakedBalance)) {
      alert('You could not withdraw more than what you staked')
    } else if (Date.now() < props.earlyWithdraw * 1000) {
      alert(`Could not withdraw, you can withdraw from  ${new Date(props.earlyWithdraw * 1000).toLocaleString()}`)
    } else {
      setMessageVisibility(true)
      //handle amount (number bigint)
      amount = BigNumber(amount * 1e18).toFixed(0)
      setMessage('Waiting for WITHDRAW confirmation, please confirm it on your Metamask extension')


      await props.stakingContract.methods.withdraw(props.account).send({ from: props.account })
        .on('transactionHash', function (txHash) {
          setMessage('Processing, please wait...!')

        })
        // .on('confirmation', function (confirmationNumber, receipt) {
        //   console.log(`onConfirmation ${confirmationNumber}`)
        // })
        .on('receipt', async function (receipt) {
          setTxHash(receipt.transactionHash)
          getyourStakedBalance()

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
            props.stakingContract.methods.stakeOf(props.account).call((error, result) => {
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
        <p><span className='boldText'>{props.poolName}</span></p>
        <p>{props.chain}</p>
        <p><span className='boldText'>YOUR ADDRESS</span></p>
        <p>{props.account}</p>
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
export default withWallet(Stake)
