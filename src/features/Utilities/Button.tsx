import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';

interface ButtonProps {
  href?: string;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

const Button = (Component, { href, disabled = false, onClick, children }) => {
  if (href) {
    const isExternal = href && href.startsWith('http');

    const aTag = <a href={href}>{children}</a>;

    return isExternal ? (
      aTag
    ) : (
      <Link href={href} passHref>
        <Component>{children}</Component>
      </Link>
    );
  }

  return (
    <Component disabled={disabled} onClick={onClick}>
      {children}
    </Component>
  );
};

const StyledButton = styled.button`
  display: flex;
  flex: none;
  align-items: center;
  outline: none;

  svg {
    margin-right: 8px;
  }

  &:focus {
    outline: none;
    box-shadow: ${(props) => props.theme.boxShadow.outline};
  }
`;

const StyledLink = styled.a`
  display: flex;
  flex: none;
  align-items: center;
  padding: 8px 1.2rem;
  border-radius: 2px;
  text-decoration: none;

  &:focus {
    outline: none;
    box-shadow: ${(props) => props.theme.boxShadow.outline};
  }
`;

const StyledDarkLink = styled(StyledLink)`
  border: none;
  background-color: transparent;
  color: #fff;
  font-size: 1.4rem;

  &:hover {
    cursor: pointer;
    background-color: #071735;
  }

  &:focus {
    outline: none;
    box-shadow: ${(props) => props.theme.boxShadow.outline};
  }
`;

const StyledInvertedLink = styled(StyledLink)`
  font-size: 1.4rem;
  text-decoration: none;
  border: 1px solid ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.primary};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.primary};
    color: #fff;
  }
`;

const StyledPrimaryLink = styled(StyledLink)`
  border: none;
  background-color: ${(props) => props.theme.colors.primary};
  color: #fff;
  font-size: 1.4rem;

  &:hover {
    cursor: pointer;
    background-color: ${(props) => props.theme.colors.newBlues[500]};
  }
`;

export const DarkLink = (props) => Button(StyledDarkLink, props);
export const PrimaryLink = (props) => Button(StyledPrimaryLink, props);
export const InvertedLink = (props) => Button(StyledInvertedLink, props);
