import './poolInfor.css'
import { useState } from 'react'
import Web3 from "web3/dist/web3.min"
import FestakedWithReward from '../../artifacts/contracts/FestakedWithReward.sol/FestakedWithReward.json'
// const stakingContractAddr = '0x1FE470E4E533EeA525b2f2c34a9EbB995597C143'
const stakingContractAddr = '0xa49403Be3806eb19F27163D396f8A77b40b75C5f'


function PoolInfor() {
    const [account, setAccount] = useState('0x0000000000000000000000000000000000000000')

    connectMM()
    async function connectMM() {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0])
    }

    window.ethereum.on('accountsChanged', async () => {
        setAccount(window.ethereum.selectedAddress)
        getYourStakedBalance()
    });
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
        setStakingCap((result / 1e18).toLocaleString('en-EN'))
    })

    // Staked so far
    const [stakedBalance, setStakedBalance] = useState('')
    stakingContract.methods.stakedBalance().call((error, result) => {
        setStakedBalance((result / 1e18).toLocaleString('en-EN'))
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
    return (
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
    )
}

export default PoolInfor