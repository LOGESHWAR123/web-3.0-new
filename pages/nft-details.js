import { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { NFTContext } from '@/context/nftcontext';
import { NFTCard, Loader, Banner, Modal } from '@/components';
import images from '../assets';
import { shortenAddress } from '@/utils/shortedAddress';

const PaymentBodyCmp = ({ nft, nftCurrency }) => (
  <div className="flex flex-col">
    <div className="flexBetween">
      <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-base minlg:text-xl">Item</p>
      <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-base minlg:text-xl">Subtotal</p>
    </div>

    <div className="flexBetweenStart my-5">
      <div className="flex-1 flexStartCenter">
        <div className="relative w-28 h-28">
          <Image src={nft.image || images[`nft${nft.i}`]} layout="fill" objectFit="cover" />
        </div>
        <div className="flexCenterStart flex-col ml-5">
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm minlg:text-xl">{shortenAddress(nft.seller)}</p>
          <p className="font-poppins dark:text-white text-nft-black-1 text-sm minlg:text-xl font-normal">{nft.name}</p>
        </div>
      </div>

      <div>
        <p className="font-poppins dark:text-white text-nft-black-1 text-sm minlg:text-xl font-normal">{nft.price} <span className="font-semibold">{nftCurrency}</span></p>
      </div>
    </div>

    <div className="flexBetween mt-10">
      <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-base minlg:text-xl">Total</p>
      <p className="font-poppins dark:text-white text-nft-black-1 text-base minlg:text-xl font-normal">{nft.price} <span className="font-semibold">{nftCurrency}</span></p>
    </div>
  </div>
);
const NFTDetails = () => {
  const { currentAccount, nftCurrency, buyNFT, peer } = useContext(NFTContext);
  const [isloading, setisloading] = useState(true);
  const [nft, setnft] = useState({ image: '', tokenId: '', name: '', owner: '', price: '', seller: '' });
  const [paymentModal, setpaymentModal] = useState(false);
  const [sucess, setsucess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    setnft(router.query);
    setisloading(false);
  }, [router.isReady]);

  const checkout = async () => {
    await buyNFT(nft);

    setpaymentModal(false);
    setsucess(true);
  };

  const handleTransfer = async () => {
    router.push({
      pathname: '/sender',
      query: nft,
    });
  };

  if (isloading) return <Loader />;
  return (
    <div className="relative flex justify-center md:flex-col min-h-screen">
      <div className="relative flex-1 flexCenter sm:p-4 p-12 border-r md:border-r-0 md:border-b dark:border-nft-black-1 border-nft-gray-1">
        <div className="relative w-557 minmd:w-2/3 minmd:h-2/3 sm:w-full sm:h-300 h-557">
          <Image src={nft.image} objectFit="cover" className="rounded-xl shadow-lg" layout="fill" />
        </div>
      </div>
      <div className="flex-1 justify-start sm:px-4 p-12 sm:pb-4">
        <div className="flex flex-row sm:flex-col">
          <h2 className="font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl minlg:text-3xl">{nft.name}</h2>
        </div>
        <div className="mt-10">
          <p className="font-poppins dark:text-white text-nft-black-1 text-xs minlg:text-base font-normal"> Creator</p>
          <div className="flex flex-row items-center mt-3">
            <div className="relative w-12 h-12 minlg:w-20 minlg:h-20 mr-2">
              <Image src={images.creator8} objectFit="cover" className="rounded-full" />
            </div>
            <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl minlg:text-3xl">{shortenAddress(nft.seller)}</p>
          </div>
        </div>
        <div className="mt-10 flex flex-col">
          <div className="w-full border-b dark:border-nft-black-1 border-nft-gray-1 flex flex-row">
            <p className="font-poppins dark:text-white text-nft-black-1 text-xs minlg:text-base font-medium mb-2"> Details</p>
          </div>
          <div className="mt-3">
            <p className="font-poppins dark:text-white text-nft-black-1 text-xs minlg:text-base font-medium mb-2">{nft.description}</p>
          </div>
        </div>
        <div className="flex flex-row sm:flex-col mt-10">
          {currentAccount === nft.seller.toLowerCase()
            ? (
              <p className="font-poppins dark:text-white text-nft-black-1 text-xs minlg:text-base font-normal border border-gray p-2">
                Cannot trade own NFT
              </p>
            ) : currentAccount === nft.owner.toLowerCase()
              ? (
                <button
                  type="button"
                  className="nft-gradient text-sm minlg:text-lg py-2 px-6 minlg:px-8 font-popins font-semibold text-white mx-2 rounded-xl mr-5 sm:mr-0 sm:mb-5"
                  onClick={() => router.push(`/resel-nft?tokenId=${nft.tokenId}&tokenURI=${nft.tokenURI}`)}
                >
                  List on Marketplace
                </button>
              ) : (
                <button
                  type="button"
                  className="nft-gradient text-sm minlg:text-lg py-2 px-6 minlg:px-8 font-popins font-semibold text-white mx-2 rounded-xl"
                  onClick={() => setpaymentModal(true)}
                >
                  {`Buy for ${nft.price} ${nftCurrency}`}
                </button>
              )}
          {currentAccount === nft.owner.toLowerCase()
            ? (
              <button
                type="button"
                className="nft-gradient text-sm minlg:text-lg py-2 px-6 minlg:px-8 font-popins font-semibold text-white mx-2 rounded-xl"
                onClick={handleTransfer}
              >
                Transfer NFT to other account
              </button>
            ) : (
              <p>
                NFT is listed in Marketplace - Cannot Transfer
              </p>
            )}
        </div>
      </div>
      {paymentModal
      && (
      <Modal
        header="Buy NFT"
        body={<PaymentBodyCmp nft={nft} nftCurrency={nftCurrency} />}
        footer={(
          <div className="flex flex-row sm:flex-col">
            <button
              type="button"
              className="nft-gradient text-sm minlg:text-lg py-2 px-6 minlg:px-8 font-popins font-semibold text-white mx-2 rounded-xl mr-5 sm:mb-5 sm:mr-0"
              onClick={checkout}
            >
              Checkout
            </button>
            <button
              type="button"
              className="nft-gradient text-sm minlg:text-lg py-2 px-6 minlg:px-8 font-popins font-semibold text-white mx-2 rounded-xl"
              onClick={() => setpaymentModal(false)}
            >
              Cancel
            </button>
          </div>
        )}
        handleClose={() => setpaymentModal(false)}
      />
      )}
      {sucess
      && (
      <Modal
        header="Payment Sucessfull"
        body={(
          <div className="flexCenter flex-col text-center" onClick={() => setpaymentModal(false)}>
            <div className="relative w-52 h-52">
              <Image src={nft.image} objectFit="cover" layout="fill" />
            </div>
            <p className="font-poppins dark:text-white text-nft-black-1 text-sm minlg:text-xl font-normal mt-10">You sucessfully purchased <span className="font-semibold">{nft.name} </span> from <span className="font-semibold">{shortenAddress(nft.seller)} </span></p>
          </div>
       )}
        footer={(
          <div className="flexCenter flex-row">
            <button
              type="button"
              className="nft-gradient text-sm minlg:text-lg py-2 px-6 minlg:px-8 font-popins font-semibold text-white mx-2 rounded-xl sm:mb-5 sm:mr-0"
              onClick={() => router.push('/my-nfts')}
            >
              Check it Out
            </button>
          </div>
      )}
        handleClose={() => setpaymentModal(false)}
      />
      )}
    </div>
  );
};

export default NFTDetails;
