import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import fetch from 'isomorphic-unfetch';
import {
  Error,
  FormWrapper,
  Form,
  Input,
  InputWrapper,
  Label,
  Title,
  SubmitButton,
  WithSpinner,
  Spinner,
} from './styles';
import { authenticateUser } from '../Auth/authSlice';
import { setCookieOnSignin } from '../../utils/auth';
import API_URL from '../../utils/url';

const SignupSchema = Yup.object().shape({
  email: Yup.string().email().required('please provide and email!'),
  username: Yup.string()
    .required('please provide a username!')
    .min(4, 'username must be between 4-25 characters')
    .max(25, 'username must be between 4-25 characters'),
  password: Yup.string()
    .required('please provide a password!')
    .min(6, 'password must have at least 6 characters'),
});

const SignupForm: React.FC<{}> = () => {
  const [error, setError] = useState<string>('');
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: { email: '', username: '', password: '' },
    validationSchema: SignupSchema,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSubmit: async (
      { email, username, password },
      { setSubmitting, resetForm }
    ) => {
      setSubmitting(true);
      try {
        const response = await fetch(`${API_URL}/api/signup`, {
          method: 'POST',
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, username, password }),
        });

        if (response.ok) {
          const { token, user } = await response.json();

          await setCookieOnSignin({ token });
          dispatch(authenticateUser({ authenticated: token, user }));
          resetForm();
        } else {
          const { message } = await response.json();
          console.log('message from response', message);
          setError(message);
        }
      } catch (error) {
        console.log('message from error', error);
        setError(error.message);
      }
      setSubmitting(false);
    },
  });

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError('');
      }, 4000);
    }
  }, [error]);

  return (
    <FormWrapper>
      <Title>Sign Up</Title>
      <Form onSubmit={formik.handleSubmit}>
        <InputWrapper>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="text"
            placeholder="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            error={formik.touched.email && formik.errors.email}
          />
          <Error
            visible={formik.touched.email && formik.errors.email ? true : false}
          >
            {formik.errors.email}
          </Error>
        </InputWrapper>
        <InputWrapper>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            type="text"
            placeholder="username"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.username}
            error={formik.touched.username && formik.errors.username}
          />
          <Error
            visible={
              formik.touched.username && formik.errors.username ? true : false
            }
          >
            {formik.errors.username}
          </Error>
        </InputWrapper>
        <InputWrapper>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            error={formik.touched.password && formik.errors.password}
          />
          <Error
            visible={
              formik.touched.password && formik.errors.password ? true : false
            }
          >
            {formik.errors.password}
          </Error>
        </InputWrapper>
        <InputWrapper>
          <SubmitButton type="submit" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? (
              <WithSpinner>
                <div>Processing...</div>
                <Spinner />
              </WithSpinner>
            ) : (
              'Sign Up'
            )}
          </SubmitButton>
          <Error visible={error ? true : false}>{error}</Error>
        </InputWrapper>
      </Form>
    </FormWrapper>
  );
};
export default SignupForm;
