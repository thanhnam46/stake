import React from "react";
import "./connectWallet.css";
import metamaskLogo from "../../assets/logos/metamaskLogo.svg";
import walletconnectLogo from "../../assets/logos/walletconnectLogo.svg";

export default function ConnectWallet() {
  return (
    <div className="selectWallet">
      <p>Please connect your wallet with us!</p>
      <div className="walletWrapper">
        <img src={metamaskLogo} alt="Metamask" className="walletLogo" />
        <img
          src={walletconnectLogo}
          alt="WalletConnect"
          className="walletLogo"
        />
      </div>
    </div>
  );
}
