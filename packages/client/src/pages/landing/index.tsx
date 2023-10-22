import Button from '@/components/Button';
import Layout from '@/layout';
import landingArt from '../../assets/landing-art.png';

const LandingPage = () => (
  <Layout>
    <div className='flex gap-x-5 mt-28'>
      {/* Left half */}
      <div className='space-y-10'>
        <h1 className='text-5xl font-bold text-secondary-300 tracking-wide leading-[1.2]'>
          Amicus - Your Friends, <br /> Everywhere You Go
        </h1>
        <h2 className='text-neutral-600 text-lg'>
          Unlock a New Era of Social Connectivity in Web3. Own Your Network, Seamlessly Connect Across Multiple Blockchains.
        </h2>
        <Button size='lg' intent='primary' href='/register' className='rounded-full py-5 !px-28'>
          Get Started
        </Button>
      </div>

      {/* Right half */}
      <div className='pt-40'>
        <img src={landingArt} alt='landing page art' className='w-full' />
      </div>
    </div>
  </Layout>
);

export default LandingPage;
