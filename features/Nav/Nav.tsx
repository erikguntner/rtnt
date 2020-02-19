import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
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

  const { authenticated, user } = useSelector((state: RootState) => ({
    authenticated: state.auth.authenticated,
    user: state.auth.user,
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
            <li>
              <Avatar>
                <Username>{user.username}</Username>
                <AvatarIcon>
                  <FontAwesomeIcon icon={faUserCircle} />
                </AvatarIcon>
                <Dropdown>
                  <button onClick={logout}>Sign Out</button>
                </Dropdown>
              </Avatar>
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

const Avatar = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  background-color: transparent;
  border: none;
  font-size: 1.4rem;
  color: #fff;

  &:hover {
    & > div {
      display: block;
    }
  }
`;

const Username = styled.span`
  margin-right: 6px;
`;

const scaleDot = keyframes`
  0% {
    opacity: 1;
    transform: scale(1);
  }

  100% {
    opacity: 0;
    transform: scale(3);
  }
`;

const AvatarIcon = styled.span`
  position: relative;
  font-size: 2.4rem;

  &::before {
    content: '';
    background-color: ${props => props.theme.colors.teal[400]};
    position: absolute;
    top: 5px;
    right: -3px;
    height: 8px;
    width: 8px;
    border-radius: 50%;
    animation: ${scaleDot} 1s infinite;
  }

  &::after {
    content: '';
    background-color: ${props => props.theme.colors.teal[400]};
    position: absolute;
    top: 5px;
    right: -3px;
    height: 8px;
    width: 8px;
    border-radius: 50%;
  }
`;

const Dropdown = styled.div`
  display: none;
  position: absolute;
  bottom: 0;
  right: 0;
  width: 15rem;
  transform: translateY(100%);
  background-color: #fff;
  border-radius: 2px;
  z-index: 20;
  color: black;
  box-shadow: ${props => props.theme.boxShadow.lg};
  overflow: hidden;

  & a,
  button {
    display: block;
    border: none;
    background-color: transparent;
    width: 100%;
    text-align: left;
    padding: 4px 12px;
    color: ${props => props.theme.colors.gray[600]};
    font-size: 1.4rem;

    &:hover {
      background-color: ${props => props.theme.colors.gray[300]};
    }
  }
`;

const SignOut = styled.button`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: none;
  border-radius: 2px;
  background-color: transparent;
  color: ${props => props.theme.colors.gray[400]};
  font-size: 1.4rem;

  &:hover {
    cursor: pointer;
    background-color: #071735;
    color: #fff;
  }
`;

export default Nav;
