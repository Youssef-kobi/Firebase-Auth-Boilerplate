import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FcGoogle } from 'react-icons/fc';
import { loginSchema } from '../constants/YupValidations';
import { useAuth } from '../context/auth';
import * as PATHS from '../constants/routes';
import { signInWithEmailAndPassword } from 'firebase/auth';

import { auth, handleAuthError, signInWithGoogle } from '../services/firebase';
import LoadingPage from './LoadingPage';
import { useEffect } from 'react';

const Login = () => {

useEffect(() => {
  document.title = 'Login Page | ReactJS Firebase Auth Boilerplate';
}, []);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({ resolver: yupResolver(loginSchema) });
  const { login } = useAuth();
  const onSubmitHandler = async (data) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      if (userCredential.user.emailVerified) {
        login(userCredential.user);
      } else {
        setError(
          'email',
          { type: 'custom', message: 'Please verify your Email Address' },
          { shouldFocus: true }
        );
      }
      // reset();
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        handleAuthError(error.code, 'password', setError);
      } else {
        handleAuthError(error.code, 'email', setError);
      }
    }
  };
  // google sign in handler
  const googleSignInHandler = async () => {
    signInWithGoogle()
      .then(async (userCredential) => {
        try {
          login(userCredential.user);
        } catch (error) {
          console.error(error);
          alert('An error occurred while fetching profile data');
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error('User not logged in');
      });
  };
  return (
    <>
      {isSubmitting && <LoadingPage />}
      <div className='container md:w-1/2 lg:w-1/3 p-4 bg-[#f0f8ff7d] drop-shadow-[0_100px_25px_rgba(0,0,0,0.25)] rounded-3xl flex flex-col items-center px-3 font-Public'>
        <div className='flex flex-col items-center  w-full'>
          {/* <img className='mb-12 h-[30px] mx-0 ' src='./Logo.png' alt='logo' /> */}
          <h1 className=' text-4xl text-center font-bold text-gray-900 mb-2'>
            Sign in
          </h1>
          <p className='mb-6 text-center text-gray-900 text-opacity-80 text-base '>
            Sign in to continue
          </p>
        </div>
        <div className=' flex flex-col items-center w-full rounded'>
          <form
            onSubmit={handleSubmit(onSubmitHandler)}
            className='flex flex-col w-full px-8 py-4'
          >
            <div className='flex flex-col w-full mb-3 text-gray-900  font-medium'>
              <label className='mb-2 ' htmlFor='email'>
                Email
              </label>
              <div
                className={`flex w-full border rounded-xl h-10 ${
                  !errors.email?.message
                    ? 'border-gray-600 '
                    : 'border-red-700 border-2'
                }`}
              >
                <label
                  htmlFor='email'
                  className='flex justify-center items-center w-12'
                >
                  <svg
                    className='w-5 h-5 text-gray-600 '
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                    />
                  </svg>
                </label>
                <input
                  id='email'
                  className='w-full px-4 py-2 placeholder:text-gray-600 rounded-xl bg-transparent outline-none'
                  {...register('email')}
                  placeholder='Email'
                  type='text'
                  disabled={isSubmitting}
                />
              </div>
              <p className='text-xs px-1 text-red-700'>
                {errors.email?.message}
              </p>
            </div>
            <div className='flex flex-col w-full mb-3 font-medium'>
              <div className='flex justify-between items-center'>
                <label className='mb-2 ' htmlFor='password'>
                  Password
                </label>
                <Link className='text-xs' to={PATHS.RESETPASSWORD}>
                  Forgot password ?
                </Link>
              </div>
              <div
                className={`flex w-full border rounded-xl h-10 ${
                  !errors.password?.message
                    ? 'border-gray-600'
                    : 'border-red-700 border-2'
                }`}
              >
                <label
                  htmlFor='password'
                  className='bg-white-light flex justify-center items-center w-12'
                >
                  <svg
                    className='w-5 h-5 text-gray-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                    />
                  </svg>
                </label>
                <input
                  id='password'
                  className='w-full placeholder:text-gray-600 px-4 py-2 rounded-xl bg-transparent outline-none'
                  {...register('password')}
                  placeholder='Password'
                  type='password'
                  disabled={isSubmitting}
                />
              </div>
              <p className='text-xs px-1 text-red-700'>
                {errors.password?.message}
              </p>
            </div>
            <button
              className=' rounded-xl mt-2 px-4 py-2 bg-[#891c2c] active:bg-opacity-80 hover:bg-opacity-90 drop-shadow-[0_100px_25px_rgba(0,0,0,0.25)] text-gray-200 font-medium'
              type='submit'
            >
              Sign in
            </button>
          </form>
          <div>
            <button className='button' onClick={googleSignInHandler}>
              <FcGoogle
                className='drop-shadow-[0_10px_25px_rgba(0,0,0,0.55)]'
                size={46}
              />
            </button>
          </div>
        </div>
        <div className='mt-8 w-full flex items-center flex-col'>
          <p>
            Don&apos;t have an account ?{' '}
            <Link to='/register' className='text-[#a11e31]'>
              Signup now
            </Link>
          </p>
          <p className='  mt-8 flex items-center'>
            @ 2023. Crafted with
            <svg
              className='w-6 h-6 fill-rose-800'
              fill='currentColor'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fillRule='evenodd'
                d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z'
                clipRule='evenodd'
              />
            </svg>
            by Youssef ELKOBI
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
