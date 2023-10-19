import { classNames } from '@/utils';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

type SelectionProps = {
  name: string;
  className?: string;
  detached?: boolean;
};

const ChainSelectionTablet: React.FC<SelectionProps> = ({ name, className = '' }) => {
  const [selectedChain, setSelectedChain] = useState('Goerli');
  const [showOptions, setShowOptions] = useState(false);

  const { setValue, formState } = useFormContext() ?? {};
  const { errors, touchedFields } = formState ?? {};
  const isTouched = touchedFields?.[name];
  const hasError = !!errors?.[name] && isTouched;

  const supportedChains = [
    { name: 'Goerli', chainId: 5 },
    { name: 'Mumbai', chainId: 80001 },
  ];

  return (
    <div className='relative'>
      <div className={classNames('flex gap-x-3', className)}>
        <button
          type='button'
          className='flex gap-x-4 bg-slate-200 rounded-xl px-2'
          onClick={() => setShowOptions((prev) => !prev)}
        >
          <ChevronDownIcon
            className={classNames('h-5 w-5 transition-all', showOptions ? 'rotate-180' : '')}
          />
          <span className='px-4'>{selectedChain}</span>
        </button>
        {hasError && (
          <div className='mb-1 text-sm text-red-400 shadow-sm'>
            {errors[name]?.message as string}
          </div>
        )}
      </div>

      {showOptions && (
        <div className='mt-3 border w-fit absolute bg-white'>
          {supportedChains.map((chain) => (
            <button
              type='button'
              key={chain.chainId}
              className={classNames(
                'flex items-center gap-x-3 p-2 rounded-md w-full hover:bg-primary-100',
                selectedChain === chain.name ? 'bg-primary-100' : 'bg-white',
              )}
              onClick={() => {
                setSelectedChain(chain.name);
                setValue(name, chain.chainId);
                setShowOptions(false);
              }}
            >
              <span className='inline-block h-6 w-6 rounded-full bg-slate-300'></span>{' '}
              <span>{chain.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChainSelectionTablet;
