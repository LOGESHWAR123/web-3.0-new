import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { NFTContext } from '@/context/nftcontext';
import { Loader } from '@/components';
import Input from '../components/Input';

const ReselNFT = () => {
  const { createSale } = useContext(NFTContext);
  const router = useRouter();
  const { tokenURI, tokenId } = router.query;
  const [price, setprice] = useState('');
  const [image, setimage] = useState('');
  const [isloading, setisloading] = useState(true);

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

  const resell = async () => {
    await createSale(tokenURI, price, true, tokenId);
    router.push('/');
  };
  return (
    <div className="flex justify-center sm:px-4 p-12">
      <div className="w-3/5 md:w-full">
        <h1 className="font-poppins dark:text-white text-nft-black font-semibold text-2xl">Resell NFT</h1>
        <Input
          inputType="number"
          title="Price"
          placeholder="NFT Price"
          handleClick={(e) => setprice(e.target.value)}
        />
        {image && <img src={image} className="rounded mt-4" width={350} />}

        <div className="mt-7 w-full flex justify-end">
          <button
            type="button"
            className="nft-gradient text-sm minlg:text-lg py-2 px-6 minlg:px-8 font-popins font-semibold text-white mx-2 rounded-xl rounded-full"
            onClick={resell}
          >
            List NFT
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReselNFT;
