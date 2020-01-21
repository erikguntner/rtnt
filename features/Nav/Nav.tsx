import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';

interface Links {
  href: string;
  label: string;
  key?: string;
}

const links: Links[] = [
  { href: 'https://zeit.co/now', label: 'ZEIT', key: '' },
  { href: 'https://github.com/zeit/next.js', label: 'GitHub', key: '' },
].map(link => {
  link.key = `nav-link-${link.href}-${link.label}`;
  return link;
});

const Nav = () => (
  <NavContainer>
    <ul>
      <li>
        <Link href="/">
          <a>Home</a>
        </Link>
        <Link href="/about">
          <a>About</a>
        </Link>
      </li>
      {links.map(({ key, href, label }) => (
        <li key={key}>
          <a href={href}>{label}</a>
        </li>
      ))}
    </ul>
  </NavContainer>
);

const NavContainer = styled.nav`
  background-color: ${props => props.theme.colors.gray[800]};
  text-align: center;

  & ul {
    display: flex;
    justify-content: space-between;
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
