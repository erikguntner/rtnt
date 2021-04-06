import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';

export interface Props {
  disabled?: boolean;
  handleClick: () => void;
  icon: IconDefinition;
  tooltip: string;
  activeState?: boolean;
  rotate?: number;
  id: string;
}

const ControlButton: React.FC<Props> = ({
  disabled,
  handleClick,
  icon,
  tooltip,
  activeState = false,
  rotate = 0,
  id,
}) => {
  const [focused, setFocused] = useState<boolean>(false);
  const btnRef = useRef(null);

  const click = () => {
    if (disabled) {
      return;
    }

    handleClick();
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
      {...{ activeState, disabled, focused, rotate }}
      onClick={click}
      data-testid={`control-btn-${id}`}
      disabled={disabled}
    >
      <FontAwesomeIcon icon={icon} />
      <Tooltip>{tooltip}</Tooltip>
    </Button>
  );
};

interface ButtonProps {
  focused: boolean;
  activeState: boolean;
  disabled: boolean;
  rotate: number;
}

const Button = styled.button<ButtonProps>`
  position: relative;
  border: none;
  font-size: 2rem;
  padding: 1.2rem 3.2rem;
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

  @media screen and (max-width: ${(props) => props.theme.screens.md}) {
    flex: 1;
    padding: 8px 0;
  }

  &:not(:last-child) {
    border-right: 1px solid ${(props) => props.theme.colors.gray[200]};
  }

  &:hover {
    cursor: pointer;
  }

  &:disabled {
    cursor: not-allowed;
  }

  /* & > span {
    visibility: ${({ focused }) => (focused ? 'visible' : 'hidden')};
    opacity: ${({ focused }) => (focused ? 1 : 0)};
    transform: ${({ focused }) =>
    focused ? 'translate3d(10%, 133%, 0)' : 'translate3d(10%, 100%, 0)'};
  } */

  & svg {
    transform: ${({ rotate }) => `rotate(${rotate}deg)`};
  }

  &:focus {
    outline: none;
  }

  @media (hover: hover) {
    &:hover > span {
      visibility: visible;
      opacity: 1;
      transform: translate3d(-50%, 133%, 0);
    }
  }

  &:active::after {
    width: 0;
  }
`;

const Tooltip = styled.span`
  visibility: hidden;
  position: absolute;
  opacity: 0;
  bottom: 0;
  left: 50%;
  width: max-content;
  padding: 4px 1.2rem;
  margin-top: 1rem;
  background-color: #333;
  border-radius: 2px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05), 0 1px 2rem rgba(0, 0, 0, 0.04);
  text-align: center;
  color: #fff;
  font-size: 1.2rem;
  transform: translate3d(-50%, 100%, 0);
  transition: all 0.2s ease;

  &::before {
    content: '';
    position: absolute;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-bottom: 6px solid #333;
    top: -6px;
    left: 87px;
    z-index: 1090;
    left: 50%;
    transform: translate3d(-50%, 10%, 0);
  }
`;

const InnerButton = styled.div<ButtonProps>`
  height: 100%;
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

export default ControlButton;
