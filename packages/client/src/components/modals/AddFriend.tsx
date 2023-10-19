import Modal from '@/components/modals';
import { AmicusProfileContext } from '@/context/AmicusProfileContext';
import useChainExplorer from '@/hooks/useChainExplorer';
import React, { useContext, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ThreeDots } from 'react-loader-spinner';
import AmicusProfile from '../../abis/AmicusProfile.json';
import ethereumArt from '../../assets/ethereum.png';
import polygonArt from '../../assets/polygon.png';
import Button from '../Button';
import Input from '../Input';
import Select from '../Select';

const networks = [
  {
    label: 'Mumbai',
    value: 80001,
    avatar: polygonArt,
  },
  {
    label: 'Goerli',
    value: 5,
    avatar: ethereumArt,
  },
];

type Props = {
  show?: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddFriendModal: React.FC<Props> = ({ show = false, setShow }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const profile = useContext(AmicusProfileContext);
  const { writeFn, transaction, prepare } = useChainExplorer({
    abi: AmicusProfile,
    contract: profile,
  });

  useEffect(() => {
    if (transaction.isSuccess || transaction.isError || prepare.isError) {
      setIsSubmitting(false);
    }
  }, [transaction.isError, transaction.isSuccess, prepare.isError]);

  const methods = useForm({
    mode: 'all',
    defaultValues: {
      address: '',
      chain: '',
    },
  });

  const onSubmit = methods.handleSubmit((input) => {
    setIsSubmitting(true);
    const isValid = !!profile && !!input.address;
    writeFn('sendFriendRequest', [input.address], isValid);
  });

  const renderContent = () => {
    return (
      <div className='px-10 h-fit py-7'>
        <FormProvider {...methods}>
          <form className='flex flex-col gap-y-7'>
            <Select name='chain' options={networks} />

            <Input name='address' placeholder='0x0000000' className='border !border-black w-full' />

            <Button
              type='submit'
              size='lg'
              intent='secondary'
              className='rounded-full w-80 mx-auto flex text-center justify-center items-center gap-x-2'
              disabled={!profile || isSubmitting}
              onClick={onSubmit}
            >
              <span className='-mt-1'>{isSubmitting ? 'Adding' : 'Add Friend'}</span>
              <ThreeDots
                height='20'
                width='20'
                radius='5'
                color='brown'
                ariaLabel='three-dots-loading'
                visible={isSubmitting}
              />
            </Button>
          </form>
        </FormProvider>
      </div>
    );
  };

  return (
    <Modal
      title='Add Friend'
      open={show}
      size='lg'
      onClose={() => setShow(false)}
      renderContent={renderContent}
    />
  );
};

export default AddFriendModal;
