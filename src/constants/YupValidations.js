import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  // username: yup.string().min(8).max(32).required().label('Username'),

  email: yup.string().email().min(8).max(32).required().label('Email'),
  password: yup.string().min(8).max(32).required().label('Password'),
});

export const registerSchema = yup.object().shape({
  email: yup.string().email().min(8).max(32).required().label('Email'),
  password: yup.string().min(8).max(32).required().label('Password'),
});

export const profileSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  birthDate: yup
    .date()
    .required('BirthDate is required')
    .max(new Date(), "You can't be born in the future"),
  address: yup
    .string()
    .required('Address is required')
    .min(8, 'Address is too short')
    .max(100, 'Address is too long'),
  // avatar: yup.string().url('Invalid image URL').required('Image is required'),
});

export const resetPasswordSchema = yup.object().shape({
  email: yup.string().email().min(8).max(32).required().label('Email'),
});

export const searchSchema = yup.object().shape({
  search: yup.string().min(3).max(32).label('search'),
});

export const messageSchema = yup.object().shape({
  search: yup.string().min(1).max(200).label('Message'),
});
