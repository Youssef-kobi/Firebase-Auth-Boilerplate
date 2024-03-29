import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import { profileSchema } from '../constants/YupValidations';
import * as PATHS from '../constants/routes';
import { storage } from '../services/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { SlLocationPin } from 'react-icons/sl';
import LoadingPage from './LoadingPage';
const Profile = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    setValue,
    watch,
  } = useForm({ resolver: yupResolver(profileSchema) });
  const Navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef();

  const [avatarUrl, setAvatarUrl] = useState('');
  const [canvasUrl, setCanvasUrl] = useState('');

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  useEffect(() => {
    document.title = 'Profile Page | ReactJS Firebase Auth Boilerplate';
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }
    const { firstName, lastName, displayName, photoURL, birthDate, address } =
      user;
    setAvatarUrl(photoURL);
    setValue(
      'firstName',
      firstName || (displayName && displayName.split(' ')[0]) || ''
    );
    setValue(
      'lastName',
      lastName || (displayName && displayName.split(' ')[1]) || ''
    );
    setValue(
      'birthDate',
      birthDate
        ? new Date(user.birthDate.seconds * 1000).toISOString().slice(0, 10)
        : ''
    );
    setValue('address', address);
    setUploadProgress(100);
  }, [user, setValue]);

  const firstName = watch('firstName');
  const lastName = watch('lastName');

  useEffect(() => {
    if (!user.photoURL) {
      // Create a canvas element
      const canvas = document.createElement('canvas');
      canvas.width = 200;
      canvas.height = 200;

      // Get the 2D rendering context
      const ctx = canvas.getContext('2d');

      // Set the background color
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, 200, 200);

      // Set the text color and font
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 52px Arial';

      if (!firstName || !lastName) {
        return;
      }
      const initials = firstName[0]?.toUpperCase() + lastName[0]?.toUpperCase();
      // Get the initials of the user

      // Measure the width of the text
      const textWidth = ctx.measureText(initials).width;

      // Draw the text in the center of the canvas
      ctx.fillText(initials, (200 - textWidth) / 2, 120);

      // Convert the canvas to a data URL
      const dataURL = canvas.toDataURL();
      setCanvasUrl(dataURL);
    }
  }, [user, firstName, lastName]);

  useEffect(() => {
    fileInputRef.current = register('avatar', fileInputRef.current);
  }, [register]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const onSubmitHandler = async ({
    firstName,
    lastName,
    birthDate,
    address,
  }) => {
    try {
      const updatesObject = {
        displayName: `${firstName} ${lastName}`,
        firstName,
        lastName,
        photoURL: avatarUrl,
        birthDate,
        address,
      };

      await updateUser(updatesObject);
      Navigate(PATHS.DASHBOARD);
    } catch (error) {
      console.log(error);
    }
  };

  const uploadAvatar = async (e) => {
    try {
      setIsUploading(true);

      const file = fileInputRef.current.files[0];

      // Validate file size
      const maxSize = 2.5 * 1024 * 1024; // 2.5MB
      if (file.size > maxSize) {
        throw new Error(
          `File size should be less than ${maxSize / 1024 / 1024}MB`
        );
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`File type should be jpeg or png`);
      }
      const avatarRef = ref(storage, `avatars/${user.uid}`);
      const uploadAvatar = uploadBytesResumable(avatarRef, file);
      uploadAvatar.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          setUploadProgress(progress);
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadAvatar.snapshot.ref).then((downloadURL) => {
            setAvatarUrl(downloadURL);
          });
        }
      );
      setAvatarUrl(avatarUrl);
      setIsUploading(false);
    } catch (error) {
      setError(
        'avatar',
        { type: 'custom', message: error.message },
        { shouldFocus: true }
      );
      setIsUploading(false);
    }
  };
  return (
    <>
      {isSubmitting && <LoadingPage />}
      <div className='container md:w-1/2 lg:w-1/3 p-4 bg-[#f0f8ff7d] drop-shadow-[0_100px_25px_rgba(0,0,0,0.25)] rounded-3xl flex flex-col items-center px-3 font-Public'>
        <div className='flex flex-col items-center  w-full'>
          <h1 className=' text-4xl text-center font-bold text-gray-900 mb-2'>
            Profile
          </h1>
          <p className='mb-6 text-center text-gray-600 text-base '>
            Complete your registration
          </p>
        </div>
        <div className=' flex flex-col items-center w-full rounded'>
          <form
            onSubmit={handleSubmit(onSubmitHandler)}
            className='flex flex-col w-full px-10'
          >
            <div className='flex flex-col items-center justify-center w-full mb-4 text-gray-900 font-medium'>
              <div className='relative h-32 w-32'>
                <CircularProgressbarWithChildren
                  value={uploadProgress}
                  strokeWidth={6}
                  styles={{
                    path: {
                      stroke: 'url(#gradient)',
                      zIndex: '1',
                    },
                    trail: {
                      zIndex: '-1',
                    },
                  }}
                >
                  <svg>
                    <defs>
                      <linearGradient
                        id='gradient'
                        x1='0%'
                        y1='0%'
                        x2='100%'
                        y2='100%'
                      >
                        {/* <stop offset='0%' stopColor='#113a4d' />
                      <stop offset='15%' stopColor='#535a69' /> */}
                        <stop offset='0%' stopColor='#d79a64' />
                        <stop offset='45%' stopColor='#81152a' />
                        <stop offset='65%' stopColor='#d79a64' />
                        <stop offset='95%' stopColor='#81152a' />
                      </linearGradient>
                    </defs>
                  </svg>
                  <img
                    src={avatarUrl ? avatarUrl : canvasUrl}
                    alt='Avatar'
                    onClick={handleAvatarClick}
                    className={`${
                      isUploading === true ? 'filter blur' : ''
                    } rounded-full absolute h-full w-full p-1.5 cursor-pointer`}
                    onMouseOver={() => setIsHovering(true)}
                    onMouseOut={() => setIsHovering(false)}
                  />
                  {isHovering && (
                    <div className='bg-gray-200 opacity-50 rounded-full border-2 border-transparent h-full w-full pointer-events-none flex justify-center items-center absolute'>
                      <FaCloudUploadAlt className='h-16 w-16 m-auto' />
                    </div>
                  )}
                  <input
                    type='file'
                    name='avatar'
                    style={{ display: 'none' }}
                    onChange={uploadAvatar}
                    // {...register('avatar')}
                    ref={(instance) => {
                      ref(instance); // RHF wants a reference to this input
                      fileInputRef.current = instance; // We also need it to manipulate the element
                    }}
                    accept='image/*'
                  />
                </CircularProgressbarWithChildren>
              </div>
              {errors.avatar && (
                <p className='text-red-500 text-sm'>{errors.avatar.message}</p>
              )}
              {isUploading && (
                <p className='text-gray-600 text-sm'>Uploading...</p>
              )}
            </div>
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
                  />
                </div>
                <p className='text-xs px-1 first-letter:uppercase text-red-700'>
                  {errors.lastName?.message}
                </p>
              </div>
            </div>
            <div className='flex flex-col w-full mb-3 font-medium'>
              <label className='mb-2 ' htmlFor='birthDate'>
                Birth Date
              </label>
              <div
                className={`flex w-full border rounded-xl h-10 ${
                  !errors.birthDate?.message
                    ? 'border-gray-600'
                    : 'border-red-700 border-2'
                }`}
              >
                <input
                  id='birthDate'
                  className='w-full px-4 py-2  text-gray-900 placeholder:text-gray-900  rounded-xl bg-transparent outline-none'
                  {...register('birthDate')}
                  placeholder='Birth Date'
                  type='date'
                />
              </div>
              <p className='text-xs px-1 first-letter:uppercase text-red-700'>
                {errors.birthDate?.message}
              </p>
            </div>

            <div className='flex flex-col w-full mb-3  font-medium mr-4'>
              <label className='mb-2 ' htmlFor='address'>
                Address
              </label>
              <div
                className={`flex w-full border rounded-xl h-10 ${
                  !errors.address?.message
                    ? 'border-gray-600'
                    : 'border-red-700 border-2'
                }`}
              >
                <label
                  htmlFor='address'
                  className='bg-white-light flex justify-center items-center w-12'
                >
                  <SlLocationPin className='w-5 h-5 text-gray-600' />
                </label>
                <input
                  id='address'
                  className='w-full px-4 py-2 placeholder:text-gray-600 rounded-xl bg-transparent outline-none'
                  {...register('address')}
                  placeholder='123 Main St, Anytown USA'
                  type='text'
                />
              </div>
              <p className='text-xs px-1 first-letter:uppercase text-red-700'>
                {errors.address?.message}
              </p>
            </div>

            <button
              className=' rounded-xl mt-2 px-4 py-2 bg-[#891c2c] active:bg-opacity-80 hover:bg-opacity-90 drop-shadow-[0_100px_25px_rgba(0,0,0,0.25)] text-gray-200 font-medium'
              type='submit'
              disabled={isUploading}
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
export default Profile;
