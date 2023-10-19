/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import pofileArt from '@/assets/profile-picture.png';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Skeleton from '@/components/Skeleton';
import { AmicusProfileContext } from '@/context/AmicusProfileContext';
import useChainExplorer from '@/hooks/useChainExplorer';
import Layout from '@/layout';
import { truncateAddress } from '@/utils';
import { useContext } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import AmicusProfile from '../../abis/AmicusProfile.json';

const ProfilePage = () => {
  const profile = useContext(AmicusProfileContext);
  const { writeFn, readFn, isLoading } = useChainExplorer({
    abi: AmicusProfile,
    contract: profile,
  });
  const navigate = useNavigate();

  const methods = useForm({
    mode: 'all',
    defaultValues: {
      address: '',
    },
    reValidateMode: 'onChange',
  });

  // If no profile in the Amicus Context then redirect to landing page
  if (!profile) {
    return navigate('/');
  }

  const reads = [
    'name',
    'image',
    'getFriends',
    'getInboundFriendRequests',
    'getOutboundFriendRequests',
  ];

  const result = readFn(reads, !!profile);

  if (result.length < 1)
    return (
      <Layout>
        <Skeleton rowCount={7} />;
      </Layout>
    );

  // change const to let to preview
  const [profileName, profileImage, profileFriends, profileInboundReqs, profileOutboundReqs] =
    result as [
      string,
      string,
      { profile: `0x${string}`; chain: number }[],
      { profile: `0x${string}` }[],
      { profile: `0x${string}` }[],
    ];
  console.log('profileImage', profileImage);

  // uncomment to preview
  // profileFriends = [
  //   {
  //     name: 'test',
  //     image: 'https://avatars.githubusercontent.com/u/5527340?v=4',
  //   },
  //   {
  //     name: 'test',
  //     image: 'https://avatars.githubusercontent.com/u/5527340?v=4',
  //   },
  // ];

  // profileInboundReqs = [
  //   {
  //     profile: '0xbAe7d9DD0b1818073e9eF0724E2e43B719677fEE',
  //   },
  //   {
  //     profile: '0xbAe7d9DD0b1818073e9eF0724E2e43B719677fEE',
  //   },
  // ];

  // profileOutboundReqs = [
  //   {
  //     profile: '0xbAe7d9DD0b1818073e9eF0724E2e43B719677fEE',
  //   },
  //   {
  //     profile: '0xbAe7d9DD0b1818073e9eF0724E2e43B719677fEE',
  //   },
  // ];

  const acceptFriendReqest = (req: { profile: `0x${string}` }) => {
    writeFn('acceptFriendRequest', [req.profile], !!profile && !!req.profile);
  }

  const onSubmit = methods.handleSubmit((input) => {
    console.log('clicked');
    const isValid = !!profile && !!input.address;
    console.log('IS VALID', isValid);
    writeFn('sendFriendRequest', [input.address], !!profile && !!input.address);
  });

  return (
    <Layout>
      <div className='flex gap-x-10'>
        <div className='flex flex-col gap-y-10 flex-1'>
          <div className='h-fit relative overflow-hidden'>
            <img src={pofileArt} alt='' className='w-full' />
            <p className='absolute bg-black font-bold py-3 bg-opacity-25 text-center bottom-0 right-0 left-0 text-white'>
              <Skeleton>{profileName}</Skeleton>
            </p>
          </div>

          <div className='space-y-7'>
            <h3 className='font-bold border-b pb-4 border-primary-300'>Friends</h3>
            <div className='space-y-4'>
              {profileFriends.length ? (
                profileFriends.map((friend, index) => (
                  <div key={index} className='flex justify-between items-end'>
                    <div className='gap-x-4 items-center flex'>
                      <div className='rounded-full h-10 w-10 border border-gray-400 overflow-hidden bg-slate-300'>
                        <img src={friend.image} alt='' />
                      </div>
                      <p>{truncateAddress(friend.profile)}</p>
                    </div>
                    <Button size='sm' className='h-10 text-white bg-rose-500'>
                      Remove
                    </Button>
                  </div>
                ))
              ) : (
                <p className='text-center'>No friends yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Right half */}
        <div className='w-[40%] space-y-10'>
          <FormProvider {...methods}>
            <form className='space-y-3'>
              <Input
                name='address'
                label='Add Friend'
                placeholder='Enter an address you wish to send a friend request'
                className='w-full py-3'
                disabled={!profile || isLoading}
              />
              <Button
                size='sm'
                type='submit'
                intent='secondary'
                className='h-10 text-white ml-auto'
                disabled={methods.getValues('address') === '' || !profile || isLoading}
                onClick={onSubmit}
              >
                {isLoading ? 'Sending...' : 'Send'}
              </Button>
            </form>
          </FormProvider>

          <div className='border border-primary-300 rounded-lg h-[30vh] px-4 py-3 bg-white'>
            <p className='border-b pb-3'>Inbound Requests</p>
            <div className='py-3 space-y-3'>
              {profileInboundReqs.length ? (
                profileInboundReqs.map((req) => (
                  <div className='flex gap-x-2 items-center'>
                    <p className='flex-1'>{truncateAddress(req.profile, 12)}</p>
                    <Button size='sm' intent='secondary' className='text-white' onClick={() => acceptFriendReqest(req)}>
                      Accept
                    </Button>
                    <Button size='sm' className='bg-rose-500 text-white'>
                      Reject
                    </Button>
                  </div>
                ))
              ) : (
                <div className='flex items-center justify-center h-full w-full'>
                  <p className='text-center text-gray-400 mt-5'>No inbound requests</p>
                </div>
              )}
            </div>
          </div>

          <div className='border border-primary-300 rounded-lg h-[30vh] px-4 py-3 bg-white'>
            <div className='border-b pb-3'>Outbound Requests</div>
            <div className='py-3 space-y-4'>
              {profileOutboundReqs.length ? (
                profileOutboundReqs.map((req) => (
                  <div className='flex gap-x-2 items-center'>
                    <p className='flex-1'>{truncateAddress(req.profile, 12)}</p>
                    <span className='bg-neutral-100 text-neutral-500 border rounded-sm px-2 text-sm'>
                      Pending
                    </span>
                  </div>
                ))
              ) : (
                <div className='flex items-center justify-center h-full w-full'>
                  <p className='text-center text-gray-400 mt-5'>No outbound requests</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
