'use client'
require('dotenv').config()
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const COINBASE_API_URL = 'https://api.coinbase.com/v2/';
const API_KEY = process.env.CB_KEY_SECRET2;  // Replace with your actual API key

const fetchCoinbaseData = async () => {
  try {
    const response = await axios.get(`${COINBASE_API_URL}accounts`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching data from Coinbase:', error);
    return [];
  }
};

const getStakedEth = (accounts) => {
  return accounts.find(account => account.currency === 'ETH2'); // ETH2 is the ticker for staked ETH
};

const getCoinBalance = (accounts, coin) => {
  return accounts.find(account => account.currency === coin);
};

const CoinbaseWallet = () => {
  const [accounts, setAccounts] = useState([]);
  const [eth2, setEth2] = useState(null);
  const [btc, setBtc] = useState(null);
  const [sol, setSol] = useState(null);

  useEffect(() => {
    const loadCoinbaseData = async () => {
      const accountsData = await fetchCoinbaseData();
      setAccounts(accountsData);

      const stakedEthAccount = getStakedEth(accountsData);
      setEth2(stakedEthAccount ? stakedEthAccount.balance.amount : 0);

      const btcAccount = getCoinBalance(accountsData, 'BTC');
      setBtc(btcAccount ? btcAccount.balance.amount : 0);

      const solAccount = getCoinBalance(accountsData, 'SOL');
      setSol(solAccount ? solAccount.balance.amount : 0);
    };

    loadCoinbaseData();
  }, []);

  return (
    <div>
      <h2>Coinbase Wallet Balances</h2>
      <p>Staked ETH (ETH2): {eth2}</p>
      <p>BTC: {btc}</p>
      <p>SOL: {sol}</p>
    </div>
  );
};

export default CoinbaseWallet;
