import React from 'react';
import { NextPage } from 'next';
import styled from 'styled-components';
import LoginForm from '../features/Forms/LoginForm';
// import { withRedux } from '../utils/redux';

const Login: NextPage<{}> = () => {
  return (
    <Container>
      <LoginForm />
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

export default Login;
