import React, { useState } from "react";
import "./app.css";
import Header from "./components/header/header";
import Stake from "./components/stake/Stake";
import Footer from "./components/footer/footer";
import metamaskLogo from "./assets/logos/metamaskLogo.svg";
import walletconnectLogo from "./assets/logos/walletconnectLogo.svg";
import detectEthereumProvider from "@metamask/detect-provider";
import WalletConnectProvider from "@walletconnect/web3-provider";
// import Web3 from "web3";
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
  let provider;
  const handleMetamask = async () => {
    console.log("connect to MM");
    provider = await detectEthereumProvider();

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

  const disConnect = () => {
    setSelectedAddress("Please connect your wallet first!");
  };
  const handleWalletConnect = async () => {
    console.log("connect to WL");
    //  Create WalletConnect Provider
    provider = new WalletConnectProvider({
      rpc: {
        97: "https://data-seed-prebsc-1-s1.binance.org:8545",
      },
    });

    //  Enable session (triggers QR Code modal)
    // await provider.enable();
    // const web3 = new Web3(provider);

    // //  Get Accounts
    // const accounts = await web3.eth.getAccounts();
    // console.log(accounts);
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
            <a
              onClick={
                selectedAddress === "Please connect your wallet first!" ||
                !selectedAddress
                  ? showWalletSelection
                  : disConnect
              }
              className="links"
            >
              {selectedAddress === "Please connect your wallet first!" ||
              !selectedAddress
                ? "Connect Wallet"
                : `Disconect from ${selectedAddress.slice(
                    0,
                    6
                  )}...${selectedAddress.slice(38, 42)}`}
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
