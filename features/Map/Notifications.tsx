import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExclamationTriangle,
  faCheck,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';

import { AppDispatch } from '../../app/store';
import { RootState } from '../../app/rootReducer';

interface Props {}

const Notifications: React.FC<Props> = () => {
  const dispatch: AppDispatch = useDispatch();
  const { isVisible, type } = useSelector((state: RootState) => ({
    isVisible: state.notifications.isVisible,
    type: state.notifications.type,
  }));

  const icon = {
    failure: faTimes,
    warning: faExclamationTriangle,
    success: faCheck,
  };

  return (
    <>
      {isVisible && (
        <Notification {...{ type }}>
          <Icon>
            <FontAwesomeIcon icon={icon[type]} />
          </Icon>
          <Text>
            <p>This is the notification message</p>
          </Text>
          <CloseButton>
            <FontAwesomeIcon icon={faTimes} />
          </CloseButton>
        </Notification>
      )}
    </>
  );
};

interface NotificationProps {
  type: string;
}

const Notification = styled.div`
  position: absolute;
  right: 2.5rem;
  bottom: 2.5rem;
  padding: 2.4rem;
  display: flex;
  z-index: 1000;
  background: #fff;

  &::before {
    position: absolute;
    content: '';
    top: 0;
    left: 0;
    height: 100%;
    width: 4px;
    background-color: ${props => props.theme.colors.green[600]};
  }
`;

const Icon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 4rem;
  width: 4rem;
  margin-right: 2rem;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.green[200]};
  font-size: 1.8rem;
  color: ${props => props.theme.colors.green[600]};
`;

const Text = styled.div`
  font-size: 1.4rem;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  margin: 8px;
  height: 1.8rem;
  width: 1.8rem;
  font-size: 1.2rem;
  border-radius: 50%;
  color: ${props => props.theme.colors.gray[800]};
  border: none;
  background-color: transparent;

  &:hover {
    cursor: pointer;
    background-color: ${props => props.theme.colors.gray[200]};
  }
`;

export default Notifications;
