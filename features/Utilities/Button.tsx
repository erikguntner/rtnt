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

export const DarkButtonLink = (props) => Button(StyledButton, props);
