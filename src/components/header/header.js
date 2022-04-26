import React from "react"
import PropTypes from "prop-types"
import "./header.css"
import withWallet from "../HOC/hoc"
function Header (props) {
  const txLink = `https://testnet.bscscan.com/address/${props.account}#tokentxns`
  props.onAccountChange()

  return (
    <header className="header">
      <img
        className="logo"
        src="https://imgur.com/Qxw1soD.jpeg"
        alt="logo"
      ></img>
      <a href={txLink} className="links" target="_blank" rel="noreferrer">
        Transaction
      </a>
      <a href="https://staking.spores.app" className="links">
        Staking Options
      </a>
    </header>
  )
}

Header.propTypes = {
  account: PropTypes.string.isRequired,
  onAccountChange: PropTypes.func.isRequired
}

export default withWallet(Header)
