import AmicusProfileFactory from '@/abis/AmicusProfileFactory.json';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { AmicusProfileContext } from '@/context/AmicusProfileContext';
import { uploadToIPFS } from '@/fetchers/uploadToIPFS';
import useChainExplorer from '@/hooks/useChainExplorer';
import Layout from '@/layout';
import { classNames, truncateAddress } from '@/utils';
import { useContext, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ThreeDots } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
import { zeroAddress } from 'viem';
import { useAccount, useMutation } from 'wagmi';

const RegisterPage = () => {
  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { address } = useAccount();
  const { connectedProfile } = useContext(AmicusProfileContext);

  const mutation = useMutation(uploadToIPFS);

  const { writeFn, isSuccess, error, isLoading } = useChainExplorer({
    abi: AmicusProfileFactory,
  });

  useEffect(() => {
    if (!isLoading) {
      setIsSubmitting(false)
    }
  }, [isLoading]);

  useEffect(() => {
    if (isSuccess || connectedProfile !== zeroAddress) {
      setIsSubmitting(false);
      navigate('/profile');
    }
  }, [navigate, isSuccess, connectedProfile]);

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

  const onSubmit = methods.handleSubmit(async (input) => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    let imageUrl = 'IMG-URL';

    if (file) {
      const formData = new FormData();
      formData.append('file', file, file.name);
      const imgHash = await mutation.mutateAsync(formData);
      imageUrl = `https://scarlet-absolute-bonobo-814.mypinata.cloud/ipfs/${imgHash}`;
    }
    writeFn('createUserProfile', [input.username, imageUrl], !!address && !!input.username);
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFile(file);
  };

  return (
    <Layout>
      <div className='flex flex-col gap-y-8 items-center justify-center max-w-2xl mx-auto rounded-xl p-10 shadow-sm border bg-black bg-opacity-10'>
        <label
          htmlFor='avatar'
          className={classNames(
            'rounded-full flex justify-center items-center h-36 w-36 mx-auto ring-2 ring-offset-2 ring-primary-300 overflow-hidden ',
            address && !isSubmitting ? 'hover:cursor-pointer' : 'hover:cursor-auto',
          )}
        >
          <input
            id='avatar'
            type='file'
            accept='image/*'
            className='hidden'
            disabled={!address || isSubmitting}
            onChange={handleImageChange}
          />
          {file ? (
            <img src={URL.createObjectURL(file)} alt='Avatar' className='object-cover' />
          ) : (
            <div className='bg-[#212121] h-full w-full'></div>
          )}
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
            Transaction failed. Please try again later.
          </p>
        )}

        <FormProvider {...methods}>
          <form>
            <fieldset className='space-y-5' disabled={!address || isSubmitting}>
              <Input name='address' label='address' readOnly className='rounded-full py-3 w-80' />
              <Input autoComplete='off' name='username' label='username' required className='rounded-full py-3 w-80' />
            </fieldset>
          </form>
        </FormProvider>
        <Button
          type='submit'
          size='lg'
          intent='primary'
          className='rounded-full w-80 flex text-center justify-center items-center gap-x-2'
          disabled={!address || isSubmitting}
          onClick={onSubmit}
        >
          <span className='-mt-1'>{isSubmitting ? 'Registering' : 'Register'}</span>
          <ThreeDots
            height='20'
            width='20'
            radius='5'
            color='brown'
            ariaLabel='three-dots-loading'
            visible={isSubmitting}
          />
        </Button>
      </div>
    </Layout>
  );
};

export default RegisterPage;
