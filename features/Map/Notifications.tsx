import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExclamationTriangle,
  faCheck,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';

import { changeNotificationStatus } from './notificationSlice';

import { AppDispatch } from '../../app/store';
import { RootState } from '../../app/rootReducer';

interface Props {}

const Notifications: React.FC<Props> = () => {
  let timeout;
  const dispatch: AppDispatch = useDispatch();
  const { isVisible, type, message } = useSelector((state: RootState) => ({
    isVisible: state.notifications.isVisible,
    type: state.notifications.type,
    message: state.notifications.message,
  }));

  const icon = {
    error: faTimes,
    warning: faExclamationTriangle,
    success: faCheck,
  };

  const notificationColor = {
    error: 'red',
    warning: 'orange',
    success: 'green',
  };

  const handleClose = () => {
    clearTimeout(timeout);
    dispatch(
      changeNotificationStatus({
        isVisible: false,
        type: '',
        message: '',
      })
    );
  };

  useEffect(() => {
    if (isVisible) {
      console.log('timeout');
      timeout = setTimeout(() => {
        dispatch(
          changeNotificationStatus({
            isVisible: false,
            type: '',
            message: '',
          })
        );
      }, 3000);
    }
  }, [isVisible]);

  return (
    <>
      {isVisible && (
        <Notification {...{ type, color: notificationColor[type] }}>
          <Icon {...{ type, color: notificationColor[type] }}>
            <FontAwesomeIcon icon={icon[type]} />
          </Icon>
          <Text>
            <p>{message}</p>
          </Text>
          <CloseButton onClick={handleClose}>
            <FontAwesomeIcon icon={faTimes} />
          </CloseButton>
        </Notification>
      )}
    </>
  );
};

interface NotificationProps {
  type: string;
  color: string;
}

const Notification = styled.div<NotificationProps>`
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
    background-color: ${props => props.theme.colors[props.color][600]};
  }
`;

const Icon = styled.div<NotificationProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 4rem;
  width: 4rem;
  margin-right: 2rem;
  border-radius: 50%;
  background-color: ${props => props.theme.colors[props.color][200]};
  font-size: 1.8rem;
  color: ${props => props.theme.colors[props.color][600]};
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
