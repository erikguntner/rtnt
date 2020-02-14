import React from 'react';
import { NextPage } from 'next';
import SignupForm from '../features/Forms/SignupForm';
import fetch from 'isomorphic-unfetch';
import styled from 'styled-components';
import { withRedux } from '../utils/redux';

interface Props {}

const Signup: NextPage<Props> = () => {
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
