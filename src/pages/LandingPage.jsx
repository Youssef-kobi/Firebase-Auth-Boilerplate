import React, { useEffect } from 'react';
import { useAuth } from '../context/auth';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    document.title = 'LandingPage | ReactJS Firebase Auth Boilerplate';
  }, []);

  return (
    <div className='container md:w-1/2 lg:w-1/3 p-4 bg-[#f0f8ff7d] drop-shadow-[0_100px_25px_rgba(0,0,0,0.25)] rounded-3xl flex flex-col items-center px-3 font-Public'>
      <p className='text-gray-700 font-bold text-3xl mb-4'>
        Welcome, {user.displayName}!
      </p>
      <p className='bg-gray-900 text-xl mx-4 bg-opacity-20 p-2 rounded-xl'>
        You have successfully logged in to the ReactJS Firebase auth
        boilerplate. This boilerplate includes Firebase authentication, routing,
        and basic styling with TailwindCSS. Feel free to customize and use it
        for your projects!
      </p>
      <div className='flex justify-center gap-4  items-center w-full '>
        <button
          type='button'
          className='rounded-xl mt-4 px-4 py-2 bg-[#891c2c] active:bg-opacity-80 hover:bg-opacity-90 drop-shadow-[0_100px_25px_rgba(0,0,0,0.25)] text-gray-200 font-medium'
          onClick={() => logout()}
        >
          Logout
        </button>
        <button
          type='button'
          className='rounded-xl mt-4 px-4 py-2 bg-[#891c2c] active:bg-opacity-80 hover:bg-opacity-90 drop-shadow-[0_100px_25px_rgba(0,0,0,0.25)] text-gray-200 font-medium'
          onClick={() => navigate('/profile')}
        >
          Profile
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
