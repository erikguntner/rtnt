import styled, { keyframes } from 'styled-components';

export const FormWrapper = styled.div`
  border-radius: 2px;
  border: 1px solid ${props => props.theme.colors.gray[300]};
  box-shadow: ${props => props.theme.boxShadow.md};
  padding: 3.2rem;
  background-color: #fff;

  @media screen and (max-width: ${props => props.theme.screens.sm}) {
    padding: 1.6rem;
    margin-top: -4rem;
  }
`;

export const Title = styled.h1`
  line-height: 1;
  font-size: 3.6rem;
  text-align: center;
  margin-bottom: 3.6rem;

  @media screen and (max-width: ${props => props.theme.screens.sm}) {
    font-size: 2.4rem;
    margin-bottom: 2.4rem;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 40rem;

  @media screen and (max-width: ${props => props.theme.screens.sm}) {
    width: 80vw;
  }
`;

export const InputWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin-bottom: 2.4rem;

  @media screen and (max-width: ${props => props.theme.screens.sm}) {
    margin-bottom: 1.6rem;
  }
`;

interface InputProps {
  error?: boolean | string;
}

export const Input = styled.input<InputProps>`
  padding: 1rem;
  background-color: #fff;
  border: 1px solid
    ${props =>
      props.error ? props.theme.colors.red[400] : props.theme.colors.gray[400]};
  border-radius: 2px;
  font-size: 1.4rem;
  box-shadow: ${props => props.theme.boxShadow.sm};
  color: ${props =>
    props.error ? props.theme.colors.red[900] : props.theme.colors.gray[900]};

  &:focus {
    outline: none;
    box-shadow: ${props => props.theme.boxShadow.outline};
    background-color: #fff;
  }
`;

export const SubmitButton = styled.button`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: none;
  border-radius: 2px;
  background-color: ${props => props.theme.colors.indigo[700]};
  color: #fff;
  font-size: 1.4rem;

  &:hover {
    cursor: pointer;
    background-color: ${props => props.theme.colors.indigo[600]};
  }

  &:active {
    background-color: ${props => props.theme.colors.indigo[800]};
  }
`;

export const Label = styled.label`
  margin-bottom: 8px;
  font-size: 1.4rem;
  font-weight: 600;
  color: ${props => props.theme.colors.gray[700]};
`;

export const Error = styled.div`
  margin-top: 6px;
  /* padding: 6px;
  border: 1px solid ${props => props.theme.colors.red[600]};
  border-radius: 2px;
  background-color: ${props => props.theme.colors.red[200]}; */
  font-size: 1.2rem;
  color: ${props => props.theme.colors.red[600]};
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

export const Spinner = styled.div`
  display: block;
  height: 2rem;
  width: 2rem;
  border-radius: 50%;
  border-right: 3px solid ${props => props.theme.colors.indigo[600]};
  border-left: 3px solid ${props => props.theme.colors.gray[100]};
  border-top: 3px solid ${props => props.theme.colors.gray[100]};
  border-bottom: 3px solid ${props => props.theme.colors.gray[100]};
  animation: ${rotate} 2s linear infinite;
`;

export const WithSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  & div:first-of-type {
    margin-right: 1.6rem;
  }
`;
