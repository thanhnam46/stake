import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Header from './components/header/header'
import Stake from './components/stake/Stake';
import PoolInfor from './components/poolInfor/poolInfor';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
let account = window.ethereum.request({ method: 'eth_requestAccounts' }, (error) => {
  if (error) {
    console.log(error)
  }else{
    console.log(account[0])
  }
})[0];

root.render(
  <React.StrictMode>
    <Header />
    <div className='container'>
      <Stake account={account} />
      <PoolInfor />
    </div>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
