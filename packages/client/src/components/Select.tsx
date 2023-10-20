import { classNames } from '@/utils';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';
import React, { Fragment, useState } from 'react';
import { useFormContext } from 'react-hook-form';

type Option = {
  label: string;
  value: string | number;
  avatar: string;
};

type Props = {
  name: string;
  options: Option[];
  defaultValue?: Option;
};

const Select: React.FC<Props> = ({ name, options, defaultValue }) => {
  const [selected, setSelected] = useState(defaultValue ?? options[0]);
  const { setValue } = useFormContext() ?? {};
  // const { errors, touchedFields } = formState ?? {};
  // const isTouched = touchedFields?.[name];
  // const hasError = !!errors?.[name] && isTouched;

  const handleChange = (option: Option) => {
    setSelected(option);
    setValue(name, option.value);
  };

  return (
    <Listbox value={selected} onChange={handleChange}>
      {({ open }) => (
        <div className='relative mt-2'>
          <Listbox.Button className='relative w-fit cursor-default rounded-xl bg-gray-100 py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-md ring-1 ring-inset sm:text-sm sm:leading-6'>
            <span className='flex items-center'>
              <img
                src={selected.avatar}
                alt=''
                className='h-5 w-5 flex-shrink-0 rounded-full object-contain'
              />
              <span className='ml-3 block truncate'>{selected.label}</span>
            </span>
            <span className='pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2'>
              <ChevronUpDownIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
            </span>
          </Listbox.Button>

          <Transition
            show={open}
            as={Fragment}
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Listbox.Options className='absolute z-10 mt-1 max-h-56 w-fit overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
              {options.map((option, idx) => (
                <Listbox.Option
                  key={idx}
                  className={({ active }) =>
                    classNames(
                      active ? 'bg-slate-200' : 'text-gray-900',
                      'relative cursor-default select-none py-2 pl-3 pr-9',
                    )
                  }
                  value={option}
                >
                  {({ selected }) => (
                    <>
                      <div className='flex items-center'>
                        <img
                          src={option?.avatar}
                          alt=''
                          className='h-5 w-5 flex-shrink-0 rounded-full object-contain'
                        />
                        <span
                          className={classNames(
                            selected ? 'font-semibold' : 'font-normal',
                            'ml-3 block truncate',
                          )}
                        >
                          {option?.label}
                        </span>
                      </div>
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  );
};

export default Select;
