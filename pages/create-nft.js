import { useState, useMemo, useContext, useCallback } from 'react';
import { useRouter, Router } from 'next/router';
import Dropzone, { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import images from '../assets';
import Input from '../components/Input';
import { NFTContext } from '@/context/nftcontext';

const CreatNFT = () => {
  const [fileurl, setfileurl] = useState(null);
  const [form, setform] = useState({ price: '', name: '', description: '' });
  const { theme } = useTheme();
  const { uploadtoIPFS, createNFT } = useContext(NFTContext);
  const router = useRouter();

  const { getRootProps, getInputProps, isdragactive, isdragaccept, isdragreject } = useDropzone({
    onDrop: useCallback(async (acceptedFile) => {
      try {
        const url = await uploadtoIPFS(acceptedFile[0]);
        console.log({ acceptedFile });
        console.log(url);
        setfileurl(url);
      } catch (error) {
        console.error('Failed to upload file:', error);
      }
    }, []),
    accept: 'image/*,audio/*,video/*,.pdf',
    maxSize: 5000000,
  });

  const filestyle = useMemo(() => (
    `dark:bg-nft-black-1 bg-white border dark:border-white border-nft-gray-2 flex flex-col items-center p-5 rounded-sm border-dashed 
    ${isdragactive && 'border-file-active'}
    ${isdragaccept && 'border-file-accept'}
    ${isdragreject && 'border-file-reject'}
    `
  ), [isdragaccept, isdragactive, isdragreject]);
  return (
    <div className="flex justify-center sm:px-4 p-12">
      <div className="w-3/5 md:w-full">
        <h1 className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold ml-4 xs:ml-0">Create new NFTs</h1>
        <div className="mt-16">
          <p className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold ml-4 xs:ml-0">Upload File</p>
        </div>
        <div className="mt-4">
          <div {...getRootProps()} className={filestyle}>
            <input {...getInputProps()} />
            <div className="flexCenter flex-col text-center">
              <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">JPG,PNG,GIF,SVG,PDf</p>
              <div className="my-12 w-full flex justify-center">
                <Image
                  src={images.upload}
                  width={100}
                  height={100}
                  object="contain"
                  alt="file upload"
                  className={theme === 'light' && 'filter invert'}
                />
              </div>
              <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm">Drag and Drop files</p>
              <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm">or Browse media on your device</p>
            </div>
          </div>
          {fileurl && (
            <aside>
              <div>
                <img src={fileurl} alt="NTF" />
              </div>
            </aside>
          )}
        </div>
        <Input
          inputType="input"
          title="Name"
          placeholder="NFT Name"
          handleClick={(e) => setform({ ...form, name: e.target.value })}
        />
        <Input
          inputType="textarea"
          title="Description"
          placeholder="NFT description"
          handleClick={(e) => setform({ ...form, description: e.target.value })}
        />
        <Input
          inputType="number"
          title="Price"
          placeholder="NFT Price"
          handleClick={(e) => setform({ ...form, price: e.target.value })}
        />

        <div className="mt-7 w-full flex justify-end">
          <button
            type="button"
            className="nft-gradient text-sm minlg:text-lg py-2 px-6 minlg:px-8 font-popins font-semibold text-white mx-2 rounded-xl"
            onClick={() => createNFT(form, fileurl, router)}
          >
            Create NFT
          </button>
        </div>
      </div>
    </div>
  );
};
export default CreatNFT;
