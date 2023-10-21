import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { NFTContext } from '@/context/nftcontext';
import { Loader } from '@/components';
import Input from '../components/Input';

const ReselNFT = () => {
  const { createSale, sendertoreciever, peer, transfer1 } = useContext(NFTContext);
  const router = useRouter();
  const { tokenURI, tokenId } = router.query;
  const [price, setprice] = useState('');
  const [image, setimage] = useState('');
  const [isloading, setisloading] = useState(true);
  const [nft, setnft] = useState([]);
  const [sender, setsender] = useState('');

  useEffect(() => {
    const { query } = router;
    const nftData = {
      name: query.name || '',
      description: query.description || '',
      image: query.image || '',
      tokenId: query.tokenId || '',
      seller: query.seller || '',
      owner: query.owner || '',
      price: query.price || '',
      tokenURI: query.tokenURI || '',
    };
    setnft(nftData);
  }, [router.query]);

  console.log('hi');
  console.log(nft.name);

  const handlesend = async () => {
    transfer1(nft, sender);
    // router.push('/');
  };

  const fetchNFT = async () => {
    if (!tokenURI) return;

    const { data } = await axios.get(tokenURI);

    setprice(data.price);
    setimage(data.image);
    setisloading(false);
  };

  useEffect(() => {
    if (tokenURI)fetchNFT();
  }, [tokenURI]);

  if (isloading) {
    return (
      <div className="flexStart min-h-screen ">
        <Loader />
      </div>
    );
  }
  return (
    <div className="flex justify-center sm:px-4 p-12">
      <div className="w-3/5 md:w-full">
        <h1 className="font-poppins dark:text-white text-nft-black font-semibold text-2xl">Transfer NFT</h1>
        <div className="dark:bg-nft-black-1 bg-white border dark:border-nft-black-1 border-nft-gray-2 rounded-lg w-full outline-none font-poppins dark:text-white text-nft-gray-2 text-base mt-4 px-4 py-3 flexBetween flex-row">
          <input
            className="flex w-full dark:bg-nft-black-1 bg-white outline-none"
            placeholder="Enter sender address"
            onChange={(e) => setsender(e.target.value)}
          />
        </div>
        {image && <img src={image} className="rounded mt-4" width={350} />}

        <div className="mt-7 w-full flex justify-end">
          <button
            type="button"
            className="nft-gradient text-sm minlg:text-lg py-2 px-6 minlg:px-8 font-popins font-semibold text-white mx-2 rounded-xl rounded-full"
            onClick={handlesend}
          >
            Transfer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReselNFT;
