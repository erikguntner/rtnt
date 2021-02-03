import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

import { DarkLink, PrimaryLink } from '../Utilities/Button';
import PopOut from '../Utilities/PopOut';
import Skeleton from '../Utilities/Skeleton';

import { RootState } from '../../reducers/rootReducer';
import { signout } from '../Auth/authSlice';

interface Links {
  href: string;
  label: string;
  key?: string;
}

const AvatarSkeleton = () => {
  return (
    <SkeletonWrapper aria-label="loading user">
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
  const avatar = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const { validating, authenticated, user } = useSelector(
    (state: RootState) => ({
      validating: state.auth.validating,
      authenticated: state.auth.authenticated,
      user: state.auth.user,
    })
  );

  const renderAuthButtons = () => {
    return (
      <AuthLinks>
        <DarkLink href="/signin">Sign In</DarkLink>
        <PrimaryLink href="/signup">Sign Up</PrimaryLink>
      </AuthLinks>
    );
  };

  const renderAvatar = () => {
    return (
      <NavLinks>
        <DarkLink href="/myroutes">My Routes</DarkLink>
        <DarkLink href="/activity/log" passHref>
          Activity Log
        </DarkLink>
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
            <Menu>
              <Link href="/myroutes">
                <a onClick={() => setOpen(false)}>My Routes</a>
              </Link>
              <Link href="/activity/log">
                <a onClick={() => setOpen(false)}>Activity Log</a>
              </Link>
              <Link href="/activity/create">
                <a onClick={() => setOpen(false)}>Create Activity </a>
              </Link>
              <Link href="/myprofile">
                <a onClick={() => setOpen(false)}>My Profile</a>
              </Link>
              <button
                onClick={() => {
                  setOpen(false);
                  dispatch(signout({ units: user.units }));
                }}
              >
                Sign Out
              </button>
            </Menu>
          </PopOut>
        </Avatar>
      </NavLinks>
    );
  };

  return (
    <NavContainer>
      <DarkLink href="/">Home</DarkLink>
      {validating ? (
        <AvatarSkeleton />
      ) : (
        <>
          {!authenticated && renderAuthButtons()}
          {authenticated && renderAvatar()}
        </>
      )}
    </NavContainer>
  );
};

const NavLinks = styled.div`
  display: flex;

  & a:nth-of-type(1),
  a:nth-of-type(2) {
    display: flex;

    @media screen and (max-width: ${(props) => props.theme.screens.md}) {
      display: none;
    }
  }

  & > a {
    margin-right: 8px;
  }
`;

const AuthLinks = styled.div`
  display: flex;

  & > a:not(:last-child) {
    margin-right: 8px;
  }
`;

const Menu = styled.div`
  & a:nth-of-type(1),
  a:nth-of-type(2) {
    display: none;

    @media screen and (max-width: ${(props) => props.theme.screens.md}) {
      display: flex;
    }
  }
`;

const NavContainer = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2.4rem;
  height: ${(props) => props.theme.navHeight};
  background-color: ${(props) => props.theme.colors.darkBlue};
  text-align: center;
`;

const Avatar = styled.div`
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
  padding: 0 1.2rem;
  border-radius: 2px;

  &:focus {
    outline: none;
    box-shadow: ${(props) => props.theme.boxShadow.outline};

    @media screen and (max-width: ${(props) => props.theme.screens.md}) {
      box-shadow: none;
    }
  }

  &:hover {
    background-color: #071735;
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
