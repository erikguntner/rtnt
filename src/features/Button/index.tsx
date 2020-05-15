import React, { ReactNode } from 'react';
import styled from 'styled-components';
import Link from 'next/link';

interface Props {
  href?: string;
  disabled?: boolean;
  children: ReactNode;
}

const Wrapper = (Component, props: Props) => {
  const { href, children, disabled, ...rest } = props;
  const button = <Component {...{ disabled, ...rest }}>{children}</Component>;

  if (href) return <Link href={href}>{button}</Link>;
  return button;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledLink = styled(Link)`
  display: flex;
  flex: none;
  align-items: center;
  outline: none;

  &:focus {
    outline: none;
    box-shadow: ${(props) => props.theme.boxShadow.outline};
  }
`;

const StyledButton = styled.button`
  display: flex;
  flex: none;
  align-items: center;
  outline: none;

  &:focus {
    outline: none;
    box-shadow: ${(props) => props.theme.boxShadow.outline};
  }
`;

const StyledDarkButton = styled.button`
  padding: 8px 1.2rem;
  border: none;
  border-radius: 2px;
  background-color: transparent;
  color: #fff;
  font-size: 1.4rem;

  &:hover {
    cursor: pointer;
    background-color: #071735;
  }
`;

const StyledPrimaryButton = styled.button`
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
    background-color: ${(props) => props.theme.colors.blue[700]};
  }
`;

export const Button = (props) => Wrapper(StyledButton, props);

export const DarkButtonLink = (props) => Wrapper(StyledDarkButton, props);

export const PrimaryButtonLink = (props) => Wrapper(StyledPrimaryButton, props);

export default Wrapper;
