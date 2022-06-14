import React from 'react';
import './header.css';
function Header(props) {
    const txLink = `https://bscscan.com/address/${props.account}#tokentxns`;

    return (
        <div className="header">
            <img className="logo" src="https://imgur.com/Qxw1soD.jpeg" alt="logo"></img>
            <a href={txLink} className="links" target="_blank" rel="noreferrer">
                Transaction
            </a>
            <a href="https://staking.spores.app" className="links">
                Staking Options
            </a>
            <a
                onClick={
                  props.account === 'Please connect your wallet first!' || !props.account
                        ? props.showWalletSelection
                        : props.disconnectWallet
                }
                className="links"
            >
                {props.account === 'Please connect your wallet first!' || !props.account
                    ? 'Connect Wallet'
                    : `Disconect from ${props.account.slice(0, 6)}...${props.account.slice(38, 42)}`}
            </a>
        </div>
    );
}

export default Header;
