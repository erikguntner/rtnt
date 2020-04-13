import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

import { DarkButtonLink, PrimaryButtonLink } from '../Button';
import PopOut from '../Utilities/PopOut';
import Skeleton from '../Utilities/Skeleton';

import { RootState } from '../../app/rootReducer';
import { removeCookieOnLogout } from '../../utils/auth';
import { authenticateUser } from '../Auth/authSlice';

interface Links {
  href: string;
  label: string;
  key?: string;
}

const AvatarSkeleton = () => {
  return (
    <SkeletonWrapper>
      <Skeleton width={'100px'} />
      <Skeleton height={'24px'} width={'24px'} borderRadius={'50%'} />
    </SkeletonWrapper>
  );
};

const SkeletonWrapper = styled.div`
  display: flex;
  align-items: center;

  & div:first-of-type {
    margin-right: 8px;
  }
`;

const Nav = () => {
  const [open, setOpen] = useState<boolean>(false);
  const avatar = useRef<HTMLLIElement>(null);
  const dispatch = useDispatch();

  const { validating, authenticated, user } = useSelector(
    (state: RootState) => ({
      validating: state.auth.validating,
      authenticated: state.auth.authenticated,
      user: state.auth.user,
    })
  );

  const logout = () => {
    dispatch(
      authenticateUser({
        authenticated: '',
        user: {
          username: '',
          email: '',
          units: user.units,
        },
      })
    );

    removeCookieOnLogout();
  };

  const renderAuthButtons = () => {
    return (
      <>
        <li>
          <DarkButtonLink href="/login">Login</DarkButtonLink>
        </li>
        <li>
          <PrimaryButtonLink href="/signup">Sign Up</PrimaryButtonLink>
        </li>
      </>
    );
  };

  const renderAvatar = () => {
    return (
      <>
        <Avatar ref={avatar}>
          <AvatarButton onClick={() => setOpen(!open)}>
            <Username>{user.username}</Username>
            <AvatarIcon>
              <FontAwesomeIcon icon={faUserCircle} />
            </AvatarIcon>
          </AvatarButton>
          <PopOut
            motionKey="navPopOut"
            parentRef={avatar}
            {...{ open, setOpen }}
          >
            <Link href="/myroutes">
              <a onClick={() => setOpen(false)}>My Routes</a>
            </Link>
            <button
              onClick={() => {
                setOpen(false);
                logout();
              }}
            >
              Sign Out
            </button>
          </PopOut>
        </Avatar>
      </>
    );
  };

  return (
    <NavContainer>
      <ul>
        <li>
          <DarkButtonLink href="/">Home</DarkButtonLink>
        </li>
      </ul>
      <ul>
        {validating ? (
          <AvatarSkeleton />
        ) : (
          <>
            {!authenticated && renderAuthButtons()}
            {authenticated && renderAvatar()}
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
  padding: 0 2.4rem;
  height: ${(props) => props.theme.navHeight};
  background-color: ${(props) => props.theme.colors.gray[800]};
  text-align: center;

  & ul {
    display: flex;
    justify-content: flex-start;
    list-style: none;
  }

  & li {
    &:not(:last-of-type) {
      margin-right: 1.2rem;
    }
  }
`;

const Avatar = styled.li`
  position: relative;
`;

const AvatarButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  background-color: transparent;
  border: none;
  font-size: 1.4rem;
  color: #fff;

  &:hover {
    cursor: pointer;

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
    background-color: ${(props) => props.theme.colors.teal[400]};
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
    background-color: ${(props) => props.theme.colors.teal[400]};
    position: absolute;
    top: 5px;
    right: -3px;
    height: 8px;
    width: 8px;
    border-radius: 50%;
  }
`;

export default Nav;
