import React from 'react';
import { NextPage } from 'next';
import styled from 'styled-components';
import SigninForm from '../src/features/Forms/SigninForm';
// import { withRedux } from '../utils/redux';

const Signin: NextPage<{}> = () => {
  return (
    <Container>
      <SigninForm />
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

export default Signin;
