import profilePicture from '@/assets/profile-picture.png';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Layout from '@/layout';

const friends = [
  {
    name: 'John Doe',
    profilePicture: '',
  },
  {
    name: 'John Doe',
    profilePicture: '',
  },
  {
    name: 'John Doe',
    profilePicture: '',
  },
  {
    name: 'John Doe',
    profilePicture: '',
  },
  {
    name: 'John Doe',
    profilePicture: '',
  },
];

const ProfilePage = () => {
  return (
    <Layout>
      <div className='flex gap-x-10'>
        <div className='flex flex-col gap-y-10 flex-1'>
          <div className='h-fit relative overflow-hidden'>
            <img src={profilePicture} alt='' className='w-full' />
            <p className='absolute bg-black font-bold py-3 bg-opacity-25 text-center bottom-0 right-0 left-0 text-white'>
              BlockChainBliss
            </p>
          </div>

          <div className='space-y-7'>
            <h3 className='font-bold border-b pb-4 border-primary-300'>Friends</h3>
            <div className='space-y-4'>
              {friends.map((friend, index) => (
                <div key={index} className='flex justify-between items-end'>
                  <div className='gap-x-4 items-center flex'>
                    <div className='rounded-full h-12 w-12 border bg-slate-300'>
                      <img src={friend.profilePicture} alt='' />
                    </div>
                    <p>{friend.name}</p>
                  </div>
                  <Button size='sm' className='h-10 text-white bg-rose-500'>
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right half */}
        <div className='w-[40%] space-y-10'>
          <form className='space-y-3'>
            <Input
              name='address'
              label='Add Friend'
              placeholder='Enter an address you wish to send a friend request'
              detached
              className='w-full py-3'
            />
            <Button size='sm' intent='secondary' className='h-10 text-white ml-auto'>
              Send Friend Request
            </Button>
          </form>

          <div className='border border-primary-300 rounded-lg h-[20vh]'></div>
          {/* height is 60% of the screen height */}
          <div className='border border-primary-300 rounded-lg h-[44vh]'></div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
