import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import { DarkButtonLink, PrimaryButtonLink } from '../Button';
import { RootState } from '../../app/rootReducer';
import { removeCookieOnLogout } from '../../utils/auth';
import { authenticateUser } from '../Auth/authSlice';

interface Links {
  href: string;
  label: string;
  key?: string;
}

const Nav = () => {
  const dispatch = useDispatch();

  const { authenticated, user, points } = useSelector((state: RootState) => ({
    authenticated: state.auth.authenticated,
    user: state.auth.user,
    points: state.route.present.points,
  }));

  const logout = () => {
    dispatch(
      authenticateUser({
        authenticated: '',
        user: {
          username: '',
          email: '',
        },
      })
    );

    removeCookieOnLogout();
  };

  return (
    <NavContainer>
      <ul>
        <li>
          <DarkButtonLink href="/">Home</DarkButtonLink>
        </li>
      </ul>
      <ul>
        {!authenticated && (
          <li>
            <DarkButtonLink href="/login">Login</DarkButtonLink>
          </li>
        )}
        {!authenticated && (
          <li>
            <PrimaryButtonLink href="/signup">Sign Up</PrimaryButtonLink>
          </li>
        )}
        {!!authenticated && (
          <>
            <li>{user.username}</li>
            <li>
              <button onClick={logout}>Sign Out</button>
            </li>
          </>
        )}
      </ul>
    </NavContainer>
  );
};

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
