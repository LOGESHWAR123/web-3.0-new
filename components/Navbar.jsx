import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import images from '../assets';

import { NFTContext } from '@/context/nftcontext';
import Button from './Button';

const MenuItems = ({ active, setactive }) => {
  const generateLink = (i) => {
    switch (i) {
      case 0:
        return '/';
      case 1:
        return '/created-nft';
      case 2:
        return '/my-nfts';

      default:
        return '/';
    }
  };
  return (
    // eslint-disable-next-line no-template-curly-in-string
    <ul className={'list-none flex justify-between flex-row ${isMobile && "flex-col"} '}>
      {['Explore NFTs', 'Listed NFTs', 'MY NFTs'].map((item, i) => (
        <li
          key={i}
          onClick={() => {
            setactive(item);
          }}
          className={`flex flex-row items-center text-base font-poppins font-semibold dark:hover:text-white hover:text-nft-gradient mx-3 ${active === item ? 'dark:text-white text-rose-500' : 'dark:text-nft-gray-2 text-black'}`}
        >
          <Link href={generateLink(i)}>{item}</Link>
        </li>
      ))}
    </ul>
  );
};

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [active, setactive] = useState('Explore NFTs');
  const router = useRouter();
  const [isopen, setisopen] = useState(false);

  console.log({ theme });

  return (
    <nav className="w-full fixed z-10 p-4 flex-row border-b bg-white flex justify-between items-center dark:bg-nft-dark dark:border-nft-black-1 border-nft-gray-1">
      <div className="flex flex-1 flex-row justify-start">
        <Link href="/">
          <div className="flex  md:hidden cursor-pointer" onClick={() => { }}>
            <Image src={images.logo02} objectFit="contain" width={32} height={32} alt="logo" />
            <p className="dark:text-white text-nft-black-1 font-semibold text-lg ml-3">Krypt</p>
          </div>
        </Link>
        <Link href="/">
          <div className="hidden md:flex onclick={() -> {}}">
            <Image src={images.logo02} objectFit="contain" width={32} height={32} alt="logo" />
          </div>
        </Link>
      </div>
      <div className="flex flex-inital flex-row justify-end">
        <div className="flex items-center mr-2">
          <input
            type="checkbox"
            className="checkbox"
            id="checkbox"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          />
          <label htmlFor="checkbox" className="flex justify-between items-center w-8 h-4 bg-black rounded-2xl p-1 relative label">
            <i className="fas fa-sun" />
            <i className="fas fa-moon" />
            <div className="w-3 h-3 absolute bg-white rounded-full ball" />
          </label>
        </div>
        <div className="md:hidden flex">
          <MenuItems active={active} setactive={setactive} />
          <div className="ml-4">
            <Button setActive={setactive} router={router} />
          </div>
        </div>
      </div>
      <div className="hidden md:flex ml-2">
        {isopen
          ? (
            <Image
              src={images.cross}
              objectFit="contain"
              width={20}
              height={20}
              alt="close"
              onClick={() => setisopen(false)}
              className={theme === 'light' && 'filter invert'}
            />
          ) : (
            <Image
              src={images.menu}
              objectFit="contain"
              width={25}
              height={25}
              alt="menu"
              onClick={() => setisopen(true)}
              className={theme === 'light' && 'filter invert'}
            />
          )}

        {isopen && (
          <div className="fixed inset-0 top-65 dark:bg-nft-dark bg-white z-10 nav-h flex justify-between flex-col">
            <div className="flex-1 p-4">
              <MenuItems active={active} setactive={setactive} isMobile />
            </div>
            <div className="p-4 border-t dark:border-nft-black-1 border-nft-gray-1">
              <Button setActive={setactive} router={router} />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
