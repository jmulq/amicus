import Button from '@/components/Button';
import Input from '@/components/Input';
import Layout from '@/layout';

const RegisterPage = () => (
  <Layout>
    <div className='flex flex-col gap-y-8 items-center justify-center max-w-2xl mx-auto rounded-xl p-10 shadow-sm border bg-black bg-opacity-10'>
      <label htmlFor='avatar' className='hover:cursor-pointer'>
        <div className='rounded-full h-36 w-36 bg-[#212121] ring-2 ring-offset-2 ring-primary-300'>
          <input id='avatar' type='file' accept='image/*' className='opacity-0' />
        </div>
      </label>
      <fieldset className='space-y-5'>
        <Input
          name='address'
          label='address'
          readOnly
          detached
          className='rounded-full py-3 w-80'
        />
        <Input
          name='username'
          label='username'
          required
          detached
          className='rounded-full py-3 w-80'
        />
      </fieldset>
      <Button size='lg' intent='primary' className='rounded-full w-80'>
        Register
      </Button>
    </div>
  </Layout>
);

export default RegisterPage;
