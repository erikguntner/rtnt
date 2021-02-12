import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import Link from 'next/link';
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
  Checkbox,
  CheckboxLabel,
  ForgotPassword,
  Row,
} from './styles';
import { setCookieOnSignin } from '../../utils/auth';
import { authenticateUser } from '../Auth/authSlice';
import API_URL from '../../utils/url';

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .required('Please provide a username!')
    .min(4, 'Username must be between 4-25 characters')
    .max(25, 'Username must be between 4-25 characters'),
  password: Yup.string().required('Please provide a password!'),
});

const SignupForm: React.FC<{}> = () => {
  const [error, setError] = useState('');

  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: { username: '', password: '', rememberMe: false },
    validationSchema: SignupSchema,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSubmit: async (
      { username, password, rememberMe },
      { setSubmitting, resetForm }
    ) => {
      setSubmitting(true);
      try {
        const response = await fetch(`${API_URL}/api/signin`, {
          method: 'POST',
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
          const { token, user } = await response.json();
          console.log(token, user);

          await setCookieOnSignin({ token, rememberMe });
          dispatch(authenticateUser({ authenticated: token, user }));
          resetForm();
        } else {
          const { message } = await response.json();
          setError(message);
        }
      } catch (error) {
        console.log('error logging in', error);
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
          <Row>
            <Checkbox>
              <input
                id="rememberMe"
                type="checkbox"
                checked={formik.values.rememberMe}
                onChange={() =>
                  formik.setFieldValue(
                    'rememberMe',
                    !formik.values.rememberMe,
                    false
                  )
                }
              />
              <CheckboxLabel htmlFor="rememberMe">Remember me</CheckboxLabel>
            </Checkbox>
            <Link href="/resetpassword">
              <ForgotPassword>Forgot password?</ForgotPassword>
            </Link>
          </Row>
        </InputWrapper>
        <InputWrapper>
          <SubmitButton data-testid="submit-btn" type="submit">
            {formik.isSubmitting ? (
              <WithSpinner>
                <div>Processing...</div>
                <Spinner />
              </WithSpinner>
            ) : (
              'Log In'
            )}
          </SubmitButton>
          <Error visible={error ? true : false}>{error}</Error>
        </InputWrapper>
      </Form>
    </FormWrapper>
  );
};
export default SignupForm;
