import AmicusProfileFactory from '@/abis/AmicusProfileFactory.json';
import Button from '@/components/Button';
import Input from '@/components/Input';
import useChainExplorer from '@/hooks/useChainExplorer';
import Layout from '@/layout';
import { classNames, truncateAddress } from '@/utils';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ThreeDots } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';

const RegisterPage = () => {
  const naviage = useNavigate();
  const { address } = useAccount();
  
  const { writeFn, isLoading, isSuccess, error } = useChainExplorer({
    abi: AmicusProfileFactory,
  });

  useEffect(() => {
    if (isSuccess) {
      naviage('/profile');
    }
  }, [naviage, isSuccess]);

  const truncatedAddress = truncateAddress(address, 15);

  const methods = useForm({
    mode: 'onBlur',
    defaultValues: {
      address: truncatedAddress,
      username: '',
    },
  });

  useEffect(() => {
    if (address) {
      methods.reset({
        address: truncatedAddress,
      });
    }

    if (!address) {
      methods.reset({
        address: '',
        username: '',
      });
    }
  }, [address, methods, truncatedAddress]);

  const onSubmit = methods.handleSubmit((input) => {
    writeFn('createUserProfile', [input.username, 'IMG-URL'], !!address && !!input.username);
  });

  return (
    <Layout>
      <div className='flex flex-col gap-y-8 items-center justify-center max-w-2xl mx-auto rounded-xl p-10 shadow-sm border bg-black bg-opacity-10'>
        <label
          htmlFor='avatar'
          className={classNames(address ? 'hover:cursor-pointer' : 'hover:cursor-auto')}
        >
          <div className='rounded-full h-36 w-36 bg-[#212121] ring-2 ring-offset-2 ring-primary-300'>
            <input
              id='avatar'
              type='file'
              accept='image/*'
              className='opacity-0'
              disabled={!address}
            />
          </div>
        </label>

        {!address && (
          <p className='bg-amber-100 text-amber-800 rounded-md px-2 py-1 text-center border'>
            Please connect your wallet to register. <br /> If you don't have a wallet, you can
            download{' '}
            <a
              href='https://metamask.io/download'
              target='_blank'
              rel='noreferrer'
              className='underline'
            >
              MetaMask
            </a>{' '}
            here
          </p>
        )}

        {address && error && (
          <p className='bg-red-100 text-red-800 rounded-md px-2 py-1 text-center border'>
            Tranaction failed. Please try again later.
          </p>
        )}

        <FormProvider {...methods}>
          <form>
            <fieldset className='space-y-5' disabled={!address || isLoading}>
              <Input name='address' label='address' readOnly className='rounded-full py-3 w-80' />
              <Input name='username' label='username' required className='rounded-full py-3 w-80' />
            </fieldset>
          </form>
        </FormProvider>
        <Button
          type='submit'
          size='lg'
          intent='primary'
          className='rounded-full w-80 flex text-center justify-center items-center gap-x-2'
          disabled={!address || isLoading}
          onClick={onSubmit}
        >
          <span className='-mt-1'>{isLoading ? 'Registering' : 'Register'}</span>
          <ThreeDots
            height='20'
            width='20'
            radius='5'
            color='brown'
            ariaLabel='three-dots-loading'
            visible={isLoading}
          />
        </Button>
      </div>
    </Layout>
  );
};

export default RegisterPage;
