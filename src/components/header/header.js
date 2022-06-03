import React from "react";
import "./header.css";
function Header(props) {
  const txLink = `https://bscscan.com/address/${props.account}#tokentxns`;
  

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
  );
}

export default Header;
