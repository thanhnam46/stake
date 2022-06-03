import React, { useState } from "react";
import "./app.css";
import Header from "./components/header/header";
import Stake from "./components/stake/Stake";
import Footer from "./components/footer/footer";
import metamaskLogo from "./assets/logos/metamaskLogo.svg";
import walletconnectLogo from "./assets/logos/walletconnectLogo.svg";
import detectEthereumProvider from "@metamask/detect-provider";

export default function () {
  let display = false;
  const [selectedAddress, setSelectedAddress] = useState("");
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
  if (
    typeof window.ethereum === "undefined" ||
    window.ethereum.selectedAddress == null
  ) {
    display = true;
  }
  const handleMetamask = async () => {
    console.log("connect to MM");
    const provider = await detectEthereumProvider();

    if (provider) {
      console.log("Ethereum successfully detected!");

      // From now on, this should always be true:
      // provider === window.ethereum

      connectMM();

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
          <Header account={selectedAddress} />
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
