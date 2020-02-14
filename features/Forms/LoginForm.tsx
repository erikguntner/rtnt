import React from 'react';
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
} from './styles';

import { login } from '../Auth/authSlice';

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .required('username is required')
    .min(4, 'username must be between 4-25 characters')
    .max(25, 'username must be between 4-25 characters'),
  password: Yup.string().required('password is required'),
});

interface Props {}

const SignupForm: React.FC<Props> = () => {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: { username: '', password: '' },
    validationSchema: SignupSchema,
    onSubmit: ({ username, password }, { setSubmitting }) => {
      dispatch(login({ username, password }));
    },
  });

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
            type="text"
            placeholder="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password ? (
            <Error>{formik.errors.password}</Error>
          ) : null}
        </InputWrapper>
        <SubmitButton type="submit">Log in</SubmitButton>
      </Form>
    </FormWrapper>
  );
};
export default SignupForm;
