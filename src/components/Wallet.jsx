import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { IconWallet } from 'icon-sdk-js';
import { useIconService } from 'components/IconService';

const INITIAL_STATE = {
  wallet: null,
  keystore: null,
  balance: null,
  iScore: {},
  stake: {},
  createWallet: null,
  unlockWallet: null,
  unloadWallet: null,
  refreshWallet: null,
  isLoading: false,
};

export const WalletContext = createContext(INITIAL_STATE);

export function useWallet() {
  return useContext(WalletContext);
}

function Wallet({ children }) {
  const { getBalance, getIScore, getStake } = useIconService();
  const [wallet, setWallet] = useState(INITIAL_STATE.wallet);
  const [keystore, setKeystore] = useState(INITIAL_STATE.keystore);
  const [balance, setBalance] = useState(INITIAL_STATE.balance);
  const [iScore, setIScore] = useState(INITIAL_STATE.iScore);
  const [stake, setStake] = useState(INITIAL_STATE.stake);
  const [isLoading, setIsLoading] = useState(INITIAL_STATE.isLoading);

  // TODO: unload wallet when icon service changes?

  function createWallet(password) {
    const wallet = IconWallet.create();
    const keystore = wallet.store(password);
    setWallet(wallet);
    setKeystore(keystore);
    refreshWallet(wallet);
  }

  function unlockWallet(keystore, password) {
    try {
      const wallet = IconWallet.loadKeystore(keystore, password);
      setWallet(wallet);
      setKeystore(keystore);
      refreshWallet(wallet);
      return true;
    } catch (_error) {
      return false;
    }
  }

  function unloadWallet() {
    setWallet(null);
    setKeystore(null);
    setBalance(INITIAL_STATE.balance);
    setIScore(INITIAL_STATE.iScore);
    setStake(INITIAL_STATE.stake);
  }

  async function refreshWallet(providedWallet) {
    setIsLoading(true);
    const address = (providedWallet || wallet).getAddress();

    const balance = await getBalance(address);
    setBalance(balance);

    const iScore = await getIScore(address);
    setIScore(iScore);

    const stake = await getStake(address);
    setStake(stake);

    setIsLoading(false);
  }

  return (
    <WalletContext.Provider
      value={{
        wallet,
        keystore,
        balance,
        iScore,
        stake,
        createWallet,
        unlockWallet,
        unloadWallet,
        refreshWallet,
        isLoading,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

Wallet.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Wallet;
