import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';

interface Props {
  disabled?: boolean;
  handleClick: () => void;
  icon: IconDefinition;
  tooltip: string;
  activeState?: boolean;
  id: string;
}

const ControlButton: React.FC<Props> = ({
  disabled,
  handleClick,
  icon,
  tooltip,
  activeState = false,
  id,
}) => {
  const [focused, setFocused] = useState<boolean>(false);
  const btnRef = useRef(null);

  const click = () => {
    if (!disabled) {
      handleClick();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.keyCode === 9) {
        if (document.activeElement.id === id) {
          setFocused(true);
        } else {
          if (focused === true) {
            setFocused(false);
          }
        }
      } else if (e.keyCode === 13) {
        if (document.activeElement.id === id) {
          click();
        }
      }
    };

    window.addEventListener('keyup', handleKeyDown);

    return () => {
      window.removeEventListener('keyup', handleKeyDown);
    };
  }, [focused, click, disabled]);

  return (
    <Button
      ref={btnRef}
      id={id}
      {...{ activeState, disabled, focused }}
      disabled={disabled}
    >
      <InnerButton {...{ activeState, disabled, focused }} onClick={click}>
        <FontAwesomeIcon icon={icon} />
      </InnerButton>
      <Tooltip>{tooltip}</Tooltip>
    </Button>
  );
};

interface ButtonProps {
  focused: boolean;
  activeState: boolean;
  disabled: boolean;
}

const Button = styled.button<ButtonProps>`
  position: relative;
  height: 4rem;
  width: 12rem;
  border: none;
  padding: 0;
  background-color: ${(props) => props.theme.colors.gray[200]};

  &:not(:last-child) {
    border-right: 1px solid ${(props) => props.theme.colors.gray[200]};
  }

  &:hover {
    cursor: pointer;
  }

  & > span {
    visibility: ${({ focused }) => (focused ? 'visible' : 'hidden')};
    opacity: ${({ focused }) => (focused ? 1 : 0)};
    transform: ${({ focused }) =>
      focused ? 'translate3d(10%, 133%, 0)' : 'translate3d(10%, 100%, 0)'};
  }

  &:focus {
    outline: none;
  }

  &:hover div:first-of-type {
    cursor: pointer;
    transform: ${(props) =>
      props.activeState
        ? 'translate3d(0, -3px, 0)'
        : 'translate3d(0, -8px, 0)'};
  }

  &:disabled div:first-of-type:hover {
    cursor: not-allowed;
  }

  &:active::after {
    width: 0;
  }

  &:disabled div:first-of-type {
    transform: translate3d(0, -3px, 0);
  }

  &:active div:first-of-type {
    transform: translate3d(0, -3px, 0);
  }

  &:visited {
    transform: translate3d(0, 3px, 0);
  }
`;

const InnerButton = styled.div<ButtonProps>`
  height: 100%;
  width: 100%;
  font-weight: 600;
  letter-spacing: 1.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) =>
    props.activeState ? props.theme.colors.indigo[100] : '#fff'};
  color: ${(props) => {
    if (props.activeState) {
      return props.theme.colors.primary;
    } else if (props.disabled) {
      return props.theme.colors.gray[600];
    } else {
      return 'black';
    }
  }};
  font-size: 2rem;
  text-transform: uppercase;
  transform: ${(props) =>
    props.activeState ? 'translate3d(0, -3px, 0)' : 'translate3d(0, -6px, 0)'};
  transition: 0.2s all linear;

  @media (hover: hover) {
    &:hover ~ span {
      visibility: visible;
      opacity: 1;
      transform: translate3d(10%, 133%, 0);
    }
  }

  &Active {
    height: 100%;
    width: 100%;
    display: flex;
    font-size: 2rem;
    align-items: center;
    justify-content: center;
    transform: translate3d(0, -3px, 0);
    background-color: ${(props) => props.theme.colors.primary};
    color: #fff;
    transition: 0.2s all ease;
  }

  &:not(:last-child) {
    border-right: 1px solid ${(props) => props.theme.colors.gray[200]};
  }
`;

const Tooltip = styled.span`
  display: flex;
  visibility: hidden;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 0;
  left: 0;
  opacity: 0;
  width: 80%;
  height: 2.5rem;
  margin-top: 1rem;
  background-color: #333;
  border-radius: 2px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05), 0 1px 2rem rgba(0, 0, 0, 0.04);
  color: #fff;
  font-size: 1.2rem;
  transform: translate3d(10%, 100%, 0);
  transition: all 0.2s ease;

  /* &::before {
    content: '';
    width: 0;
    height: 0;
    margin-right: -1rem;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 5px solid #333;
    transform: translate(2rem, -350%);
  } */
`;

export default ControlButton;
