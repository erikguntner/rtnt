import styled, { keyframes } from 'styled-components';

export const FormWrapper = styled.div`
  margin-top: 4rem;
  padding: 2.4rem;
  border-radius: 2px;
  border: 1px solid ${(props) => props.theme.colors.gray[300]};
  box-shadow: ${(props) => props.theme.boxShadow.md};
  background-color: #fff;

  @media screen and (max-width: ${(props) => props.theme.screens.sm}) {
    margin-top: 1.6rem;
    padding: 1.6rem;
  }
`;

export const Title = styled.h1`
  line-height: 1;
  font-size: 3.6rem;
  text-align: center;
  margin-bottom: 2.4rem;

  @media screen and (max-width: ${(props) => props.theme.screens.sm}) {
    font-size: 2.4rem;
    margin-bottom: 2.4rem;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 40rem;

  @media screen and (max-width: ${(props) => props.theme.screens.sm}) {
    width: 80vw;
  }
`;

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  margin-bottom: 1.8rem;

  @media screen and (max-width: ${(props) => props.theme.screens.sm}) {
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
    ${(props) =>
      props.error ? props.theme.colors.red[400] : props.theme.colors.gray[400]};
  border-radius: 2px;
  font-size: 1.6rem;
  box-shadow: ${(props) => props.theme.boxShadow.sm};
  color: ${(props) =>
    props.error ? props.theme.colors.red[900] : props.theme.colors.gray[900]};

  &:focus {
    outline: none;
    box-shadow: ${(props) =>
      props.error
        ? props.theme.boxShadow.outlineError
        : props.theme.boxShadow.outline};
    background-color: #fff;
  }
`;

export const SubmitButton = styled.button`
  padding: 8px 1.2rem;
  border: none;
  border-radius: 2px;
  background-color: ${(props) => props.theme.colors.primary};
  color: #fff;
  font-size: 1.4rem;

  &:hover {
    cursor: pointer;
    background-color: ${(props) => props.theme.colors.newBlues[500]};
  }

  &:active {
    background-color: ${(props) => props.theme.colors.blue[800]};
  }
`;

export const Label = styled.label`
  margin-bottom: 8px;
  font-size: 1.4rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.gray[700]};
`;

export const Error = styled.div<{ visible: boolean }>`
  position: absolute;
  bottom: 0;
  left: 0;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  margin-top: 6px;
  transform: ${({ visible }) =>
    visible ? 'translateY(105%)' : 'translateY(100%)'};
  /* padding: 6px;
  border: 1px solid ${(props) => props.theme.colors.red[600]};
  border-radius: 2px;
  background-color: ${(props) => props.theme.colors.red[200]}; */
  font-size: 1.2rem;
  color: ${(props) => props.theme.colors.red[700]};
  transition: all 0.3s ease;

  @media screen and (max-width: ${(props) => props.theme.screens.sm}) {
    font-size: 1rem;
  }
`;

export const Checkbox = styled.div`
  & > input[type='checkbox'] {
    display: none;

    & + label {
      background-color: #fafafa;
      border: 1px solid #cacece;
      padding: 9px;
      border-radius: 3px;
      display: inline-block;
      position: relative;
    }

    &:checked + label {
      background-color: #e9ecee;
      border: 1px solid #adb8c0;
      color: #99a1a7;
    }

    &:checked + label:after {
      content: '\2714';
      font-size: 14px;
      position: absolute;
      top: 0px;
      left: 3px;
      color: #99a1a7;
    }
  }
`;

export const CheckboxLabel = styled.label`
  display: inline;
`;

export const Spacer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.4rem;
  color: ${(props) => props.theme.colors.gray[600]};
  line-height: 1;
  margin-bottom: 2rem;

  &::before {
    content: '';
    width: 100%;
    margin-right: 8px;
    height: 2px;
    background-color: ${(props) => props.theme.colors.gray[400]};
  }

  &::after {
    content: '';
    width: 100%;
    margin-left: 8px;
    height: 2px;
    background-color: ${(props) => props.theme.colors.gray[400]};
  }
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
  border-right: 3px solid ${(props) => props.theme.colors.primary};
  border-left: 3px solid ${(props) => props.theme.colors.gray[100]};
  border-top: 3px solid ${(props) => props.theme.colors.gray[100]};
  border-bottom: 3px solid ${(props) => props.theme.colors.gray[100]};
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
