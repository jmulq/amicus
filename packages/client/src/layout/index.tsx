import Header from '@/components/Header';

type Props = {
  children: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div>
      <Header />
      <div className='body container'>{children}</div>
    </div>
  );
};

export default Layout;
