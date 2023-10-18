import { ConnectButton } from '@rainbow-me/rainbowkit';

const Header = () => {
  return (
    <div className='flex justify-between p-4 mb-10'>
      <div className='bg-slate-300'></div>
      <ConnectButton
        chainStatus='icon'
        showBalance={{
          smallScreen: false,
          largeScreen: true,
        }}
      />
    </div>
  );
};

export default Header;
