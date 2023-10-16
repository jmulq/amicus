import Button from './Button';

const Header = () => {
  return (
    <div className='flex justify-between p-4'>
      <div className='bg-slate-300'></div>
      <div>
        <Button intent='secondary' className='rounded-md px-12 py-4'>
          Connect Wallet
        </Button>
      </div>
    </div>
  );
};

export default Header;
