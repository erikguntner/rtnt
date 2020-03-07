import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import fetch from 'isomorphic-unfetch';
import * as Yup from 'yup';
import {
  Error,
  FormWrapper,
  Form,
  Input,
  InputWrapper,
  Label,
  Title,
  SubmitButton,
  Spinner,
  WithSpinner,
} from './styles';
import { setCookieOnLogin } from '../../utils/auth';
import { authenticateUser } from '../Auth/authSlice';
import API_URL from '../../util/url';

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .required('Username is required')
    .min(4, 'Username must be between 4-25 characters')
    .max(25, 'Username must be between 4-25 characters'),
  password: Yup.string().required('Password is required'),
});

const SignupForm: React.FC<{}> = () => {
  const [error, setError] = useState('');

  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: { username: '', password: '' },
    validationSchema: SignupSchema,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSubmit: async ({ username, password }, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      try {
        const response = await fetch(`${API_URL}/api/login`, {
          method: 'POST',
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
          const { token, user } = await response.json();

          await setCookieOnLogin({ token });
          dispatch(authenticateUser({ authenticated: token, user }));
          resetForm();
        } else {
          const { error } = await response.json();
          console.log(error);
          setError(error);
        }
      } catch (e) {
        console.log('error logging in', e);
        console.log(e);
        setError(error);
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
      <Title>Log In</Title>
      <Form onSubmit={formik.handleSubmit}>
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
            error={formik.touched.username && formik.errors.username}
          />
          {formik.touched.password && formik.errors.password ? (
            <Error>{formik.errors.password}</Error>
          ) : null}
        </InputWrapper>
        {error && <Error>{error}</Error>}
        <SubmitButton type="submit">
          {formik.isSubmitting ? (
            <WithSpinner>
              <div>Processing...</div>
              <Spinner />
            </WithSpinner>
          ) : (
            'Log In'
          )}
        </SubmitButton>
      </Form>
    </FormWrapper>
  );
};
export default SignupForm;
