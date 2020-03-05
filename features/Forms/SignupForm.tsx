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
import { setCookieOnLogin } from '../../utils/auth';

const SignupSchema = Yup.object().shape({
  email: Yup.string()
    .email()
    .required('email is required'),
  username: Yup.string()
    .required('username is required')
    .min(4, 'username must be between 4-25 characters')
    .max(25, 'username must be between 4-25 characters'),
  password: Yup.string().required('password is required'),
});

const url =
  process.env.NODE_ENV === 'production'
    ? 'https://rtnt.now.sh'
    : 'http://localhost:3000';

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
        const response = await fetch(`${url}/api/signup`, {
          method: 'POST',
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, username, password }),
        });

        if (response.ok) {
          const { token, user } = await response.json();

          await setCookieOnLogin({ token });
          dispatch(authenticateUser({ authenticated: token, user }));
          resetForm();
        } else {
          console.log('there was an error');
          const { error } = await response.json();
          setError(error);
        }
      } catch (e) {
        console.log('error signing up', e);
        setError('there was an error singing up');
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
          {formik.touched.email && formik.errors.email ? (
            <Error>{formik.errors.email}</Error>
          ) : null}
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
          {formik.touched.username && formik.errors.username ? (
            <Error>{formik.errors.username}</Error>
          ) : null}
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
          {formik.touched.password && formik.errors.password ? (
            <Error>{formik.errors.password}</Error>
          ) : null}
        </InputWrapper>
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
        {error && <Error>{error}</Error>}
      </Form>
    </FormWrapper>
  );
};
export default SignupForm;
