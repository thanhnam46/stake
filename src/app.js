import React, { useState } from "react";
import "./app.css";
import Header from "./components/header/header";
import Stake from "./components/stake/Stake";
import PoolInfor from "./components/poolInfor/poolInfor";
import Footer from "./components/footer/footer";
import ConnectWallet from "./components/connectWallet/connectWallet";
export default function () {
  let display = false;

  if (typeof window.ethereum === "undefined") {
    display = true;
  }

  return (
    <div className="wrapper">
      {display && <ConnectWallet />}
      {!display && (
        <>
          <Header />
          <div className="container">
            <Stake />
            <PoolInfor />
          </div>
          <Footer />
        </>
      )}
    </div>
  );
}
