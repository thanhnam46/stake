import React, { useState } from "react";
import "./app.css";
import Header from "./components/header/header";
import Stake from "./components/stake/Stake";
import Footer from "./components/footer/footer";
import metamaskLogo from "./assets/logos/metamaskLogo.svg";
import walletconnectLogo from "./assets/logos/walletconnectLogo.svg";
import detectEthereumProvider from "@metamask/detect-provider";

export default function () {
  const [display, setDisplay] = useState(false);
  function showWalletSelection() {
    setDisplay(true);
  }
  const [selectedAddress, setSelectedAddress] = useState(
    "Please connect your wallet first!"
  );
  async function connectMM() {
    const accounts = await window.ethereum.request(
      { method: "eth_requestAccounts" },
      (error) => {
        if (error) {
          console.log(error);
        }
      }
    );
    setSelectedAddress(accounts[0]);
  }
  function onAccountChange(provider) {
    provider.on("accountsChanged", async () => {
      setSelectedAddress(window.ethereum.selectedAddress);
    });
  }

  const handleMetamask = async () => {
    console.log("connect to MM");
    const provider = await detectEthereumProvider();

    if (provider) {
      console.log("Ethereum successfully detected!");

      // From now on, this should always be true:
      // provider === window.ethereum
      connectMM();
      onAccountChange(provider);
      setDisplay(false);
      // Access the decentralized web!

      // Legacy providers may only have ethereum.sendAsync
      const chainId = await provider.request({
        method: "eth_chainId",
      });
    } else {
      // if the provider is not detected, detectEthereumProvider resolves to null
      alert("Please install MetaMask Extention to your browser!");
    }
  };

  const handleWalletConnect = () => {
    console.log("connect to WL");
  };

  const formVisibility = true;
  const stakingContractAddr = process.env.REACT_APP_STK_CONTRACT;

  return (
    <div className="wrapper">
      {display && (
        <>
          <div className="selectWallet">
            <p>Please connect your wallet with us!</p>
            <div className="walletWrapper">
              <img
                src={metamaskLogo}
                alt="Metamask"
                className="walletLogo"
                onClick={handleMetamask}
              />
              <img
                src={walletconnectLogo}
                alt="WalletConnect"
                className="walletLogo"
                onClick={handleWalletConnect}
              />
            </div>
          </div>
        </>
      )}
      {!display && (
        <>
          <div className="header">
            <Header account={selectedAddress} />
            <a onClick={showWalletSelection} className="links">
              Connect Wallet
            </a>
          </div>
          <div className="container">
            <Stake
              formVisibility={formVisibility}
              stakingContractAddr={stakingContractAddr}
              account={selectedAddress}
            />
          </div>
          <Footer />
        </>
      )}
    </div>
  );
}
