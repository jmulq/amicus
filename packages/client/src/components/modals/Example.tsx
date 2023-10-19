import Modal from '@/components/modals';
import { useState } from 'react';

const ExampleModal = () => {
  const [show, setShow] = useState(true);

  const renderContent = () => {
    return <div className='p-3 pb-6'>Hey This is an example!</div>;
  };

  return (
    <Modal open={show} onClose={() => setShow(false)} renderContent={renderContent} size='md' />
  );
};

export default ExampleModal;
