import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Link } from 'react-router-dom';
import amicusLogo from '../assets/amicus-logo.png';

const Header = () => {
  return (
    <div className='flex justify-between p-4 mb-10'>
      <Link to='/'>
        <img src={amicusLogo} alt='amicus logo' className='h-12' />
      </Link>

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
