import { classNames } from '@/utils';
import React from 'react';

interface SkeletonProps {
  className?: string;
  rowCount?: number;
  children?: React.ReactNode;
}

const Skeleton: React.FC<SkeletonProps> = ({ children, className = '', rowCount = 1 }) => {
  const skeletons = Array.from({ length: rowCount }, (_, index) => {
    const isLastSkeleton = index === rowCount - 1;
    const width = isLastSkeleton ? 'w-3/4' : 'w-full';

    return (
      <div
        key={index}
        className={classNames('animate-pulse bg-gray-200 h-6 rounded-md mb-2', width, className)}
      ></div>
    );
  });

  return (
    <div className='relative space-y-8'>
      {!children && skeletons}
      {children}
    </div>
  );
};

export default Skeleton;
