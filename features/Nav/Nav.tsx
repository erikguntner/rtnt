import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';

interface Links {
  href: string;
  label: string;
  key?: string;
}

const Nav = () => (
  <NavContainer>
    <ul>
      <li>
        <Link href="/">
          <a>Home</a>
        </Link>
      </li>
      <li>
        <Link href="/about">
          <a>About</a>
        </Link>
      </li>
    </ul>
  </NavContainer>
);

const NavContainer = styled.nav`
  background-color: ${props => props.theme.colors.gray[800]};
  text-align: center;

  & ul {
    display: flex;
    justify-content: flex-start;
  }

  & > ul {
    padding: 4px 16px;
  }

  & li {
    display: flex;
    padding: 6px 8px;
  }

  & a {
    color: ${props => props.theme.colors.gray[100]};
    text-decoration: none;
    font-size: 13px;
  }
`;

export default Nav;
