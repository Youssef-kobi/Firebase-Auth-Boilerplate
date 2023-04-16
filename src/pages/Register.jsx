import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerSchema } from '../constants/YupValidations';
import pkg from '../../package.json';
import * as PATHS from '../constants/routes';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import {
  auth,
  createUserDocument,
  handleAuthError,
  signInWithGoogle,
} from '../services/firebase';
import { useAuth } from '../context/auth';
import { FcGoogle } from 'react-icons/fc';
import LoadingPage from './LoadingPage';
import { useEffect } from 'react';

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({ resolver: yupResolver(registerSchema) });

  const navigate = useNavigate();
  const { login } = useAuth();
  useEffect(() => {
    document.title = 'Register Page | ReactJS Firebase Auth Boilerplate';
  }, []);
  const onSubmitHandler = async (data) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
        );
      sendEmailVerification(userCredential.user);

      const addDoc = {
        uid: userCredential.user.uid,
        displayName: `${data.firstName} ${data.lastName}`,
        firstName: data.firstName,
        lastName: data.lastName,
        email: userCredential.user.email,
        photoURL: '',
        birthDate: '',
        address: '',
      };

      createUserDocument(addDoc);

      navigate(PATHS.LOGIN);
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
        login(userCredential.user);
      })
      .catch((error) => {
        console.log(error);
        toast.error('User not logged in');
      });
  };
  return (
    <>
      {isSubmitting && <LoadingPage />}
      <div className='container md:w-1/2 lg:w-1/3 p-4 bg-[#f0f8ff7d] rounded-3xl drop-shadow-[0_100px_25px_rgba(0,0,0,0.25)] flex flex-col items-center px-3 font-Public'>
        <div className='flex flex-col items-center w-full'>
          <h4 className=' text-4xl text-center font-bold text-gray-900 mb-2'>
            Sign Up
          </h4>
          <p className='mb-6 text-center text-gray-600 text-base '>
            Register your account
          </p>
        </div>
        <div className=' flex flex-col items-center w-full rounded'>
          <form
            onSubmit={handleSubmit(onSubmitHandler)}
            className='flex flex-col w-full px-10 py-4 text-gray-900 '
          >
            <div className='flex flex-col w-full mb-3 font-medium'>
              <div className='flex justify-between'>
                <div className='flex flex-col w-full mb-3  font-medium mr-4'>
                  <label className='mb-2 ' htmlFor='firstName'>
                    First name
                  </label>
                  <div
                    className={`flex w-full border rounded-xl h-10 ${
                      !errors.firstName?.message
                        ? 'border-gray-600'
                        : 'border-red-700 border-2'
                    }`}
                  >
                    <label
                      htmlFor='firstName'
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
                          d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                        />
                      </svg>
                    </label>
                    <input
                      id='firstName'
                      className='w-full px-4 py-2 placeholder:text-gray-600 rounded-xl bg-transparent outline-none'
                      {...register('firstName')}
                      placeholder='First Name'
                      type='text'
                      disabled={isSubmitting}
                    />
                  </div>
                  <p className='text-xs px-1 first-letter:uppercase text-red-700'>
                    {errors.firstName?.message}
                  </p>
                </div>
                <div className='flex flex-col w-full mb-3 font-medium'>
                  <label className='mb-2 ' htmlFor='lastName'>
                    Last name
                  </label>
                  <div
                    className={`flex w-full border rounded-xl h-10 ${
                      !errors.lastName?.message
                        ? 'border-gray-600'
                        : 'border-red-700 border-2'
                    }`}
                  >
                    <label
                      htmlFor='lastName'
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
                          d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                        />
                      </svg>
                    </label>
                    <input
                      id='lastName'
                      className='w-full px-4 py-2 placeholder:text-gray-600 rounded-xl bg-transparent outline-none'
                      {...register('lastName')}
                      placeholder='Last name'
                      type='text'
                      disabled={isSubmitting}
                    />
                  </div>
                  <p className='text-xs px-1 first-letter:uppercase text-red-700'>
                    {errors.lastName?.message}
                  </p>
                </div>
              </div>
              <label className='mb-2 ' htmlFor='email'>
                Email
              </label>
              <div
                className={`flex w-full border rounded-xl h-10 ${
                  !errors.email?.message
                    ? 'border-gray-600'
                    : 'border-red-700 border-2'
                }`}
              >
                <label
                  htmlFor='email'
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
                      d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                    />
                  </svg>
                </label>
                <input
                  id='email'
                  className='w-full px-4 py-2 placeholder:text-gray-600 rounded-xl bg-transparent outline-none'
                  {...register('email')}
                  placeholder='E-mail'
                  type='text'
                  disabled={isSubmitting}
                />
              </div>
              <p className='text-xs px-1 first-letter:uppercase text-red-700'>
                {errors.email?.message}
              </p>
            </div>

            <div className='flex flex-col w-full mb-3 font-medium'>
              <div className='flex justify-between items-center'>
                <label className='mb-2 ' htmlFor='password'>
                  Password
                </label>
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
                  className='w-full px-4 py-2 placeholder:text-gray-600 rounded-xl bg-transparent outline-none'
                  {...register('password')}
                  placeholder='Password'
                  type='password'
                  disabled={isSubmitting}
                />
              </div>
              <p className='text-xs px-1 first-letter:uppercase text-red-700'>
                {errors.password?.message}
              </p>
            </div>
            <button
              className=' rounded-xl mt-4 px-4 py-2 bg-[#891c2c] active:bg-opacity-90 hover:bg-opacity-90 text-gray-200 font-medium'
              type='submit'
            >
              Sign up
            </button>
            <p className='text-xs text-center mt-2 '>
              {`By registering you agree to the ${pkg.name.replace('-', ' ')} `}
              <Link className='text-[#a11e31]' to='/'>
                Terms of Use
              </Link>
            </p>
          </form>
          <div>
            <button className='button' onClick={googleSignInHandler}>
              <FcGoogle size={46} />
            </button>
          </div>
        </div>
        <div className='mt-4 w-full flex text-center items-center flex-col'>
          <p>
            Have an account ?{' '}
            <Link to='/login' className='text-[#a11e31]'>
              Sign in
            </Link>
          </p>
          <p className='flex mt-8 items-center'>
            @ 2023 Crafted with
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
            by Youssef El KOBI
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
