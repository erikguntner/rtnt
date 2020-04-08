import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
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

const useKeyPress = function (targetKey) {
  const [keyPressed, setKeyPressed] = useState(false);

  function downHandler({ key }) {
    if (key === targetKey) {
      setKeyPressed(true);
    }
  }

  const upHandler = ({ key }) => {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  };

  React.useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  });

  return keyPressed;
};

const Nav = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [cursor, setCursor] = useState<number>(0);
  const downPress = useKeyPress('ArrowDown');
  const upPress = useKeyPress('ArrowUp');
  const avatar = useRef<HTMLLIElement>(null);
  const dispatch = useDispatch();

  const { authenticated, user } = useSelector((state: RootState) => ({
    authenticated: state.auth.authenticated,
    user: state.auth.user,
  }));

  const handleClick = (e) => {
    if (avatar.current) {
      if (avatar.current.contains(e.target)) {
        // inside click
        return;
      }

      setOpen(false);
    }
  };

  const handleArrowPress = (e) => {
    console.log('check keys');
    if (e.key === 'ArrowUp') {
      console.log('arrow up');
    } else if (e.key === 'ArrowDown') {
      console.log('arrow down');
    }
  };

  useEffect(() => {
    // add when mounted
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleArrowPress);
    // return function to be called when unmounted
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.addEventListener('keydown', handleArrowPress);
    };
  }, []);

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
            <Avatar ref={avatar}>
              <AvatarButton onClick={() => setOpen(!open)}>
                <Username>{user.username}</Username>
                <AvatarIcon>
                  <FontAwesomeIcon icon={faUserCircle} />
                </AvatarIcon>
              </AvatarButton>
              <AnimatePresence>
                {open && (
                  <Dropdown
                    key="dropdown"
                    initial={{
                      opacity: 0,
                      scale: 0.95,
                      translateY: '100%',
                      transformOrigin: 'top right',
                    }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      opacity: { duration: 0.2 },
                      scale: { duration: 0.2 },
                    }}
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
                  </Dropdown>
                )}
              </AnimatePresence>
            </Avatar>
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

const Dropdown = styled(motion.div)`
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 15rem;
  padding: 1.4rem 0;
  background-color: #fff;
  border-radius: 2px;
  z-index: 20;
  color: black;
  box-shadow: ${(props) => props.theme.boxShadow.lg};
  overflow: hidden;

  & a {
    text-decoration: none;
  }

  & a,
  button {
    display: block;
    border: none;
    background-color: transparent;
    width: 100%;
    text-align: left;
    padding: 4px 12px;
    color: ${(props) => props.theme.colors.gray[600]};
    font-size: 1.4rem;

    &:hover,
    &:focus {
      background-color: ${(props) => props.theme.colors.gray[300]};
    }
  }
`;

export default Nav;
