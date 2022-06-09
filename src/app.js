import React, { useEffect, useState } from 'react';
import './app.css';
import Header from './components/header/header';
import Stake from './components/stake/Stake';
import PoolInfor from './components/poolInfor/poolInfor';
import Footer from './components/footer/footer';
import metamaskLogo from './assets/logos/metamaskLogo.svg';
import walletconnectLogo from './assets/logos/walletconnectLogo.svg';
import detectEthereumProvider from '@metamask/detect-provider';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3 from 'web3';
import FestakedWithReward from './artifacts/contracts/FestakedWithReward.sol/FestakedWithReward.json';
import tokenContract from './artifacts/contracts/tokenContract/tokenContract.json';

export default function () {
    const [chain, setChain] = useState('');
    let formVisibility =
        (chain == process.env.REACT_APP_NETWORK_VERSION) || (chain == process.env.REACT_APP_NETWORK_VERSION_HEX);
    const stakingContractAddr = process.env.REACT_APP_STK_CONTRACT;
    const [display, setDisplay] = useState(false);
    const [provider, setProvider] = useState({});
    const [selectedAddress, setSelectedAddress] = useState('Please connect your wallet first!');
    let web3;
    // Show/hide wallet selection box
    function showWalletSelection() {
        setDisplay(true);
    }

    // Subscribe to account change
    function onAccountChange(provider) {
        provider.on('accountsChanged', async (accounts) => {
            setSelectedAddress(accounts[0]);
        });
    }

    // Subscribe to chainId change
    async function onChainChange(provider) {
        provider.on('chainChanged', (chainId) => {
            setChain(chainId);
        });
    }

    // Handle metamask connection
    const handleMetamask = async () => {
        const provider = await detectEthereumProvider();
        if (provider) {
            setProvider(provider);
            const chain = provider.chainId;
            setChain(chain);

            // Get Accounts
            const accounts = await provider.request({ method: 'eth_requestAccounts' }, (error) => {
                if (error) {
                    console.log(error);
                }
            });
            setSelectedAddress(accounts[0]);
            setDisplay(false);

            onAccountChange(provider);
            onChainChange(provider);
        } else {
            // if the provider is not detected, detectEthereumProvider resolves to null
            alert('Please install MetaMask Extention to your browser!');
        }
    };

    // Handle walletConnect connection
    const handleWalletConnect = async () => {
        //  Create WalletConnect Provider
        const provider = new WalletConnectProvider({
            rpc: {
                1: 'https://eth-mainnet.public.blastapi.io', // ETH mainnet
                4: 'https://rinkeby.infura.io/v3/', // Rinkeby
                56: 'https://bsc-dataseed.binance.org/', // BSC mainnet
                97: 'https://data-seed-prebsc-1-s1.binance.org:8545', // BSC testnet
                137: 'https://polygon-rpc.com', // Polygon mainnet
            },
        });
        setProvider(provider);

        //  Enable session (triggers QR Code modal)
        await provider.enable();

        // Initialize web3 instance
        web3 = new Web3(provider);

        // Get chain
        const chain = await web3.eth.net.getId();
        setChain(chain);

        // Get Accounts
        const accounts = await web3.eth.getAccounts();
        setSelectedAddress(accounts[0]);
        setDisplay(false);

        onAccountChange(provider);
        onChainChange(provider);

        // Subscribe to session disconnection
        provider.on('disconnect', (code, reason) => {
            console.log(code, reason);
            setSelectedAddress('Please connect your wallet first!');
        });
    };

    // Handle disconnect wallet logic
    const disconnectWallet = (provider) => {
        setSelectedAddress('Please connect your wallet first!');        
    };

    // Initialize web3 instance
    web3 = new Web3(process.env.REACT_APP_BSC_PROVIDER_LINK);
    web3.eth.setProvider(provider); // chuyen sang MM provider, neu khong se gap loi Returned error: unknown account

    // Smart contract processing
    let stakingContract = new web3.eth.Contract(FestakedWithReward.abi, stakingContractAddr);

    // Define smart contract variables
    const [yourStakedBalance, setYourStakedBalance] = useState('');
    const [poolName, setPoolName] = useState('');
    const [stakingCap, setStakingCap] = useState('');
    const [stakedTotal, setStakedTotal] = useState('');
    const [earlyWithdraw, setEarlyWithdraw] = useState('');
    const [stakingStart, setstakingStart] = useState('');
    const [stakingEnds, setstakingEnds] = useState('');
    const [maturityAt, setMaturityAt] = useState('');
    const [rewardState, setRewardState] = useState('');

    async function getyourStakedBalance() {
        await stakingContract.methods.stakeOf(selectedAddress).call((error, result) => {
            setYourStakedBalance(result / 1e18);
        });
    }

    async function getPoolName() {
        await stakingContract.methods.name().call((error, result) => {
            setPoolName(result);
        });
    }

    async function getStakingCap() {
        await stakingContract.methods.stakingCap().call((error, result) => {
            setStakingCap((result / 1e18).toLocaleString('en-EN'));
        });
    }

    async function getStakedTotal() {
        stakingContract.methods.stakedTotal().call((error, result) => {
            setStakedTotal(result);
        });
    }

    async function getStakingStart() {
        await stakingContract.methods.stakingStarts().call((error, result) => {
            setstakingStart(result);
        });
    }

    async function getStakingEnd() {
        await stakingContract.methods.stakingEnds().call((error, result) => {
            setstakingEnds(result);
        });
    }

    async function getEarlyWithdraw() {
        await stakingContract.methods.withdrawStarts().call((error, result) => {
            // setEarlyWithdraw(new Date(result * 1000).toLocaleString())
            setEarlyWithdraw(result);
        });
    }

    async function getMaturityAt() {
        await stakingContract.methods.withdrawEnds().call((error, result) => {
            setMaturityAt(result);
        });
    }

    async function getRewardState() {
        await stakingContract.methods.rewardState().call((error, result) => {
            setRewardState(result);
        });
    }

    async function getDATA() {
        // Get users balance
        await getyourStakedBalance();

        // Pool Name
        await getPoolName();

        // Get staking cap
        await getStakingCap();

        // Get total staking amount on smc
        await getStakedTotal();

        // Get early withdraw
        await getEarlyWithdraw();

        // Get Staking start
        await getStakingStart();

        // Contribution close
        await getStakingEnd();

        // Maturity at
        await getMaturityAt();

        // Reward State
        await getRewardState();
    }
    if (
        selectedAddress !== 'Please connect your wallet first!' &&
        (chain == process.env.REACT_APP_NETWORK_VERSION) | (chain == process.env.REACT_APP_NETWORK_VERSION_HEX)
    ) {
        getDATA();
    }

    // Control token contract
    const tokenAddr = process.env.REACT_APP_TKN_CONTRACT;
    const tokenNPO = new web3.eth.Contract(tokenContract.abi, tokenAddr);

    return (
        <div className="wrapper">
            {display && (
                <>
                    <div className="selectWallet">
                        <p>Please connect your wallet with us!</p>
                        <div className="walletWrapper">
                            <img src={metamaskLogo} alt="Metamask" className="walletLogo" onClick={handleMetamask} />
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
                                selectedAddress === 'Please connect your wallet first!' || !selectedAddress
                                    ? showWalletSelection
                                    : disconnectWallet
                            }
                            className="links"
                        >
                            {selectedAddress === 'Please connect your wallet first!' || !selectedAddress
                                ? 'Connect Wallet'
                                : `Disconect from ${selectedAddress.slice(0, 6)}...${selectedAddress.slice(38, 42)}`}
                        </a>
                    </div>
                    <div className="container">
                        <Stake
                            formVisibility={formVisibility}
                            stakingContractAddr={stakingContractAddr}
                            account={selectedAddress}
                            chain={chain}
                            poolName={poolName}
                            tokenNPO={tokenNPO}
                            rewardState={rewardState}
                            stakingContract={stakingContract}
                        />
                        <PoolInfor
                            yourStakedBalance={yourStakedBalance}
                            formVisibility={formVisibility}
                            stakingCap={stakingCap}
                            stakedTotal={stakedTotal}
                            earlyWithdraw={earlyWithdraw}
                            stakingStart={stakingStart}
                            stakingEnds={stakingEnds}
                            maturityAt={maturityAt}
                        />
                    </div>
                    <Footer />
                </>
            )}
        </div>
    );
}
