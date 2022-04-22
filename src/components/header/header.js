import './header.css'
import { useState } from 'react'
import withWallet from '../HOC/hoc';
function Header(props) {
    let txLink = `https://testnet.bscscan.com/address/${props.account}#tokentxns`
    props.onAccountChange()

    return (
        <header className='header'>
            <img className='logo' src='https://imgur.com/Qxw1soD.jpeg' alt='logo'></img>
            <a href={txLink} className='links' target="_blank">Transaction</a>
            <a href='https://staking.spores.app' className='links'>Staking Options</a>
        </header>
    )
}

export default withWallet(Header)