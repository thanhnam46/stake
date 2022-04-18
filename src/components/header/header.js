import './header.css'
import { useState } from 'react'
function Header() {
    const [account, setAccount] = useState('0x0000000000000000000000000000000000000000')

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
    return (
        <header className='header'>
            <img className='logo' src='https://imgur.com/Qxw1soD.jpeg' alt='logo'></img>
            <a href='https://testnet.bscscan.com/address/0x1FE470E4E533EeA525b2f2c34a9EbB995597C143#tokentxns' className='links' target="_blank">Transaction</a>
            <a href='https://staking.spores.app' className='links'>Staking Options</a>
            <a href='#' className='btn connectWalletBtn links' onClick={connectMM}>Connect Wallet</a>
            <div className='disconnect' onClick={disconnect}>
                <a href='#' className='btn links'>Disconnect {account}</a>
            </div>
        </header>
    )
}

export default Header