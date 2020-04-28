import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import {
  Error,
  Form,
  Input,
  InputWrapper,
  Label,
  SubmitButton,
  Spinner,
  WithSpinner,
} from '../Forms/styles';
import API_URL from '../../utils/url';

const PasswordResetSchema = Yup.object().shape({
  email: Yup.string().email().required('please provide an email'),
});

const ResetPasswordForm: React.FC<{}> = ({}) => {
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema: PasswordResetSchema,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSubmit: async ({ email }, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      try {
        const response = await fetch(`${API_URL}/api/resetpassword`, {
          method: 'POST',
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        if (response.ok) {
          const { token, user } = await response.json();
        } else {
          const { message } = await response.json();
          setError(message);
        }
      } catch (error) {
        console.log('error resetting password in', error);
        setError(error.message);
      }

      setSubmitting(false);
    },
  });

  return (
    <Wrapper>
      <Form onSubmit={formik.handleSubmit}>
        <InputWrapper>
          <Label htmlFor="email">email</Label>
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
          <SubmitButton type="submit">
            {formik.isSubmitting ? (
              <WithSpinner>
                <div>Processing...</div>
                <Spinner />
              </WithSpinner>
            ) : (
              'send email'
            )}
          </SubmitButton>
          <Error visible={error ? true : false}>{error}</Error>
        </InputWrapper>
      </Form>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 10rem;
`;

export default ResetPasswordForm;
