import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const LoadingPage = () => {
  return (
    <div className='h-screen w-screen absolute top-0 left-0 bg-gray-200 bg-opacity-20 z-50 flex justify-center items-center'>
      <div className='flex items-center text-3xl  justify-center space-x-2 animate-pulse'>
        <FaSpinner size={24} className='text-[#891c2c] ' />
        <span className=' font-bold text-[#891c2c] '>Loading...</span>
      </div>
    </div>
  );
};

export default LoadingPage;
