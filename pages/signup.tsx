import React from 'react';
import { NextPage } from 'next';
import SignupForm from '../src/features/Forms/SignupForm';
import styled from 'styled-components';

const Signup: NextPage<{}> = () => {
  return (
    <Container>
      <SignupForm />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #fff;
`;

export default Signup;
