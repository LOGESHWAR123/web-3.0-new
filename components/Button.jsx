/* eslint-disable react/button-has-type */
import React from 'react';
import { useState, useContext } from 'react';
import { NFTContext } from '@/context/nftcontext';

const Button = ({ router }) => {
  const { connectWallet, currentAccount } = useContext(NFTContext);
  const hasConnected = false;

  const handleClick = () => {
    router.push('/create-nft');
  };
  console.log(currentAccount);
  return currentAccount ? (
    <button
      type="button"
      className="nft-gradient text-sm minlg:text-lg py-2 px-6 minlg:px-8 font-popins font-semibold text-white mx-2 rounded-xl"
      onClick={handleClick}
    >
      Create
    </button>
  ) : (
    <button
      type="button"
      className="nft-gradient text-sm minlg:text-lg py-2 px-6 minlg:px-8 font-popins font-semibold text-white mx-2 rounded-xl"
      onClick={connectWallet}
    >
      Connect
    </button>
  );
};

export default Button;
