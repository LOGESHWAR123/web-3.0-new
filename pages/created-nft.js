import { useState, useEffect, useContext } from 'react';

import { NFTContext } from '@/context/nftcontext';
import { NFTCard, Loader } from '@/components';

const CreatedNFTs = () => {
  const { fetchmynft } = useContext(NFTContext);
  const [nft, setnfts] = useState([]);
  const [isloading, setisloading] = useState(true);

  useEffect(() => {
    fetchmynft('fetchItemsListed')
      .then((items) => {
        setnfts(items);
        setisloading(false);
      });
  }, []);

  if (isloading) {
    return (
      <div className="flexStart min-h-screen ">
        <Loader />
      </div>
    );
  }

  if (!isloading && nft.length === 0) {
    return (
      <div className="flexCenter sm:p-4 p-16 min-h-screen">
        <h1 className="font-poppins dark:text-white text-nft-black-1 text-3xl font-extrabold">No Listed NFT</h1>
      </div>
    );
  }

  return (
    <div className="flex justify-center sm:px-4 px-12 min-h-screen">
      <div className="w-full minmd:w-4/5">
        <div className="mt-4">
          <h2 className="font-poppins dark:text-white text-nft-black-1 text-2xl font-semibold mt-2 ml-4 sm:ml-2">Listed NFT</h2>
          <div className="mt-3 w-full flex flex-wrap justify-start md:justify-center">
            {nft && nft.map((nfts) => <NFTCard key={nfts.owner} nft={nfts} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatedNFTs;
