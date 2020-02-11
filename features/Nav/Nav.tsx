import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';

import { DarkButtonLink, PrimaryButtonLink } from '../Button';

interface Links {
  href: string;
  label: string;
  key?: string;
}

const Nav = () => (
  <NavContainer>
    <ul>
      <li>
        <DarkButtonLink href="/">Home</DarkButtonLink>
      </li>
      <li>
        <DarkButtonLink href="/about">About</DarkButtonLink>
      </li>
    </ul>
    <ul>
      <li>
        <DarkButtonLink href="/login">Login</DarkButtonLink>
      </li>
      <li>
        <PrimaryButtonLink href="/signup">Sign Up</PrimaryButtonLink>
      </li>
    </ul>
  </NavContainer>
);

const NavContainer = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${props => props.theme.colors.gray[800]};
  text-align: center;

  & ul {
    display: flex;
    justify-content: flex-start;
    list-style: none;
  }

  & > ul {
    padding: 4px 1.6rem;
  }

  & li {
    &:not(:last-of-type) {
      margin-right: 1.2rem;
    }
  }
`;

export default Nav;
