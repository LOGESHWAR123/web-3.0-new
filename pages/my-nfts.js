import { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import { NFTContext } from '@/context/nftcontext';
import { NFTCard, Loader, Banner } from '@/components';
import images from '../assets';
import { shortenAddress } from '@/utils/shortedAddress';

const MyNFT = () => {
  const { fetchmynft, currentAccount } = useContext(NFTContext);
  const [nfts, setnfts] = useState([]);
  const [isloading, setisloading] = useState(false);

  if (isloading) {
    return (
      <div className="flexStart min-h-screen ">
        <Loader />
      </div>
    );
  }
  return (
    <div className="w-full flex justify-start items-center flex-col min-h-screen">
      <div className="w-full flexCenter flex-col">
        <Banner
          name="My NFTs"
          childStyles="text-center mb-4"
          parentStyles="h-80 justify-center"
        />
      </div>
      <div className="flexCenter flex-col mt-30 z-2">
        <div className="flexCenter w-40 h-40 sm:w-36 sm:h-36 p-1 bg:nft-black-2 rounded-full">
          <Image src={images.creator8} className="rounded-full object-cover" objectFit="cover" />
        </div>
        <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl mt-6">{shortenAddress(currentAccount)}</p>
      </div>

      {!isloading && !nfts.length ? (
        <div className="flexCenter sm:p-4 p-16 text-extrabold font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl mt-6">
          <h1>No NFTs owned</h1>
        </div>
      ) : (
        <div className="sm:px-4 p-12 w-full minmd:w-4/5 flexCenter flex-col">
          <div>
            SearchBar
          </div>
          <div>
            {nfts.map((nft) => <NFTCard key={nft.token} nft={nft} />)}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyNFT;
