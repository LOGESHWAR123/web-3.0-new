import React, { useState, useEffect } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import axios from 'axios';
import { Blob } from 'blob-polyfill';
import { NFTStorage, File } from 'nft.storage';

import { MarketAddress, MarketAddressABI } from './constants';

export const NFTContext = React.createContext();

const fetchContract = (signeOrProvider) => new ethers.Contract(MarketAddress, MarketAddressABI, signeOrProvider);

const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDVjNjA5YUMzOUY3MUJGZjRlYzY2YTZlRjA0YTYyNTEwYTI1MjRCOUQiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3OTgzNTU5MDY2OSwibmFtZSI6Ik5mdCJ9.QKzGbQ8fgfB4-8YkghKcks0_2akk2qAiZzobPra0lk0';
const client = new NFTStorage({ token: apiKey });

export const NFTProvider = ({ children }) => {
  const [currentAccount, setcurrentAcccount] = useState('');
  const nftCurrency = 'ETH';

  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) return alert('Please install metamask');

    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length) {
      setcurrentAcccount(accounts[0]);
    } else {
      console.log('No account found');
    }
    console.log({ accounts });
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) return alert('Please install metamask');

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setcurrentAcccount(accounts[0]);
    window.location.reload();
  };

  const uploadtoIPFS = async (file) => {
    try {
      const blob = new Blob([file]);
      const metadata = await client.storeBlob(blob);
      const response = await fetch(`https://ipfs.io/ipfs/${metadata}`);
      const blob1 = await response.blob();
      const url = URL.createObjectURL(blob1);
      const publicUrl = `https://ipfs.io/ipfs/${metadata}`;
      return publicUrl;
    } catch (error) {
      console.log(error);
    }
  };

  const createNFT = async (formInput, fileUrl, router) => {
    const { name, description, price } = formInput;

    if (!name || !description || !price || !fileUrl) return;
    console.log(price);
    const data = JSON.stringify({ name, description, image: fileUrl });
    try {
      const blob = new Blob([data]);
      const metadata = await client.storeBlob(blob);
      const response = await fetch(`https://ipfs.io/ipfs/${metadata}`);
      const blob1 = await response.blob();
      const url = URL.createObjectURL(blob1);
      const publicUrl = `https://ipfs.io/ipfs/${metadata}`;
      await createSale(publicUrl, price);
      console.log(3);
      console.log(url);
      router.push('/');
    } catch (error) {
      console.log(error);
    }
  };

  const createSale = async (url, fromInputPrice, isReselling, id) => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      const price = ethers.utils.parseUnits(fromInputPrice.toString(), 18);
      const contract = fetchContract(signer);
      const listingPrice = await contract.getListingPrice();

      const transaction = !isReselling
        ? await contract.createToken(url, price, { value: listingPrice.toString() })
        : await contract.resellToken(id, price, { value: listingPrice.toString() });
      console.log(price, url);
      await transaction.wait();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchNFT = async () => {
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = fetchContract(provider);

    const data = await contract.fetchMarketItems();

    console.log(data);
    const items = await Promise.all(data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
      const tokenURI = await contract.tokenURI(tokenId);
      const { data: { image, name, description } } = await axios.get(tokenURI);
      const price = ethers.utils.formatUnits(unformattedPrice.toString(), 18);
      return {
        price,
        tokenId: tokenId.toNumber(),
        seller,
        owner,
        image,
        name,
        description,
        tokenURI,
      };
    }));
    return items;
  };

  const fetchmynft = async (type) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = fetchContract(signer);

    const data = type === 'fetchItemsListed'
      ? await contract.fetchItemsListed()
      : await contract.fetchMyNFTs();

    const items = await Promise.all(data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
      const tokenURI = await contract.tokenURI(tokenId);
      const { data: { image, name, description } } = await axios.get(tokenURI);
      const price = ethers.utils.formatUnits(unformattedPrice.toString(), 18);
      return {
        price,
        tokenId: tokenId.toNumber(),
        seller,
        owner,
        image,
        name,
        description,
        tokenURI,
      };
    }));

    return items;
  };

  const buyNFT = async (nft) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = fetchContract(signer);
    const price = ethers.utils.parseUnits(nft.price, 18);

    const transaction = await contract.createMarketSale(nft.tokenId, { value: price });

    await transaction.wait();
  };

  const peer = async (nft, sender) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = fetchContract(signer);
    const price = ethers.utils.parseUnits(nft.price, 18);

    // Check if the user has enough ether to purchase the NFT.
    const balance = await provider.getBalance(signer.address);
    if (balance < price) {
      throw new Error('Not enough ether to purchase NFT');
    }

    // Create a transaction that will purchase the NFT.
    const transaction = await contract.createMarkeytSale(nft.tokenId, { value: price });

    transaction.on('confirmation', async (confirmations) => {
      console.log(`NFT purchased! ${confirmations} confirmations received.`);

      // Transfer the NFT to the sender.
      await contract.transferNFT(nft.tokenId, sender);
    });

    // Submit the transaction to the Ethereum network.
    await transaction.wait();
  };

  const transfer1 = async (nft, receiver) => {
    // Initialize a connection to the Ethereum network via Web3Modal
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();

    // Create a provider and signer using the connected Ethereum provider
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    // Fetch the contract instance for the marketplace using the signer
    const contract = fetchContract(signer);

    // Parse the NFT price into units compatible with the Ethereum network
    const price = ethers.utils.parseUnits(nft.price, 18);

    try {
      // Start a transaction to purchase and transfer the NFT
      const transaction = await contract.purchaseAndTransferNFT(nft.tokenId, { value: price, to: receiver });

      // Wait for the transaction to be confirmed on the Ethereum network
      await transaction.wait();

      console.log('NFT purchased and transferred successfully.');
    } catch (error) {
      console.error('Error purchasing and transferring NFT:', error);
    }
  };

  return (
    <NFTContext.Provider value={{ nftCurrency, connectWallet, currentAccount, uploadtoIPFS, createNFT, fetchNFT, fetchmynft, buyNFT, createSale, peer, transfer1 }}>
      {children}
    </NFTContext.Provider>
  );
};
