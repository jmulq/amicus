import { classNames } from '@/utils';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { FC, Fragment, ReactNode } from 'react';

const baseClasses =
  'my-5 inline-block transform overflow-hidden rounded-xl border border-black border-opacity-5 bg-white text-left align-middle text-neutral-900 shadow-xl transition-all sm:my-8 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300';

export type ModalProps = {
  renderContent: () => ReactNode;
  title?: string;
  open?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClose?: () => void;
} & React.ComponentProps<'div'>;

const Modal: FC<ModalProps> = ({ renderContent, title, open, className = '', size, onClose }) => {
  return (
    <div>
      <Transition appear show={open} as={Fragment}>
        <Dialog as='div' className='fixed inset-0 z-50 overflow-y-auto' onClose={() => onClose?.()}>
          <div className='min-h-screen px-1 text-center md:px-4'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-75'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='ease-in duration-75'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <Dialog.Overlay className='fixed inset-0 bg-neutral-900 bg-opacity-50 dark:bg-opacity-80' />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span className='inline-block h-screen align-middle' aria-hidden='true'>
              &#8203;
            </span>

            <Transition.Child
              as={Fragment}
              enter='ease-out duration-75'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-75'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <div
                className={classNames(
                  baseClasses,
                  className,
                  'w-[600px]',
                  size === 'sm'
                    ? 'w-[150px]'
                    : size === 'md'
                    ? 'w-[400px]'
                    : size === 'lg'
                    ? 'w-[600px]'
                    : '',
                )}
              >
                <div className='relative border-b p-5 text-center dark:border-neutral-700'>
                  <button
                    onClick={() => onClose?.()}
                    className='absolute left-2 top-1/2 -translate-y-1/2 transform sm:left-4'
                  >
                    <XMarkIcon className='h-8 w-8' />
                  </button>

                  {title && (
                    <Dialog.Title
                      as='h3'
                      className='mx-10 text-base font-semibold text-neutral-900 dark:text-neutral-200 lg:text-xl'
                    >
                      {title}
                    </Dialog.Title>
                  )}
                </div>
                {renderContent()}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Modal;
