import React from 'react';
import { FaCheckCircle, FaRegCircle } from 'react-icons/fa';

interface SelectedIconProps {
  isSelected: boolean;
  className?: string;
}

const SelectedIcon: React.FC<SelectedIconProps> = ({
  isSelected,
  className,
}) => {
  return (
    <div className={className}>
      {isSelected ? (
        <FaCheckCircle className='text-green-500 w-full h-full' />
      ) : (
        <FaRegCircle className='text-gray-500 w-full h-full' />
      )}
    </div>
  );
};

export default SelectedIcon;
