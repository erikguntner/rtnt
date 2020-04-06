import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import Pusher from 'pusher-js';

import { Input, Label } from '../Forms/styles';
import Modal from '../Utilities/Modal';
import { RootState } from '../../app/rootReducer';
import { changeNotificationStatus } from './notificationSlice';
import API_URL from '../../utils/url';

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface StatusI {
  message?: string;
  progress: number;
}

const SaveRouteModal: React.FC<Props> = ({ open, setOpen }) => {
  const [value, setValue] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('beginning save process');
  const [progress, setProgress] = useState<number>(-90);

  const dispatch = useDispatch();
  const {
    points,
    lines,
    elevationData,
    totalDistance,
    authenticated,
  } = useSelector((state: RootState) => ({
    points: state.route.present.points,
    lines: state.route.present.lines,
    elevationData: state.route.present.elevationData,
    totalDistance: state.route.present.totalDistance,
    authenticated: state.auth.authenticated,
  }));

  useEffect(() => {
    const pusher = new Pusher(process.env.PUSHER_KEY, {
      cluster: process.env.PUSHER_CLUSTER,
      encrypted: true,
    });

    const channel = pusher.subscribe('save-route');

    channel.bind('status-update', ({ message, progress }: StatusI) => {
      if (message) {
        setStatus(message);
      }
      setProgress(-progress);
    });
  }, []);

  const handleSaveRoute = async () => {
    setSaving(true);
    setValue('');
    try {
      // Make fetch request
      const body = { name: value, lines, elevationData, points, totalDistance };
      const response = await fetch(`${API_URL}/api/route`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          Authorization: JSON.stringify(authenticated),
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        setOpen(false);
        setSaving(false);
        setProgress(-90);
        dispatch(
          changeNotificationStatus({
            isVisible: true,
            type: 'success',
            message: 'We successfully saved your route',
          })
        );
      } else {
        setOpen(false);
        setSaving(false);
        setProgress(-90);
        dispatch(
          changeNotificationStatus({
            isVisible: true,
            type: 'error',
            message: 'Looks like there was an error saving your route',
          })
        );
      }
    } catch (e) {
      console.log(e);
      setOpen(false);
      setSaving(false);
      dispatch(
        changeNotificationStatus({
          isVisible: true,
          type: 'error',
          message: 'Looks like there was an error saving your route',
        })
      );
    }
  };

  return (
    <Modal {...{ open }} toggle={setOpen}>
      {!saving ? (
        <Container>
          <InputWrapper>
            <Label htmlFor="routeName">Route Name</Label>
            <Input
              id="routeName"
              name="routeName"
              type="text"
              placeholder="name"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </InputWrapper>
          <Controls>
            <CancelButton onClick={() => setOpen(!open)}>Cancel</CancelButton>
            <AcceptButton onClick={handleSaveRoute}>Save Route</AcceptButton>
          </Controls>
        </Container>
      ) : (
        <StatusContainer>
          <h4>{status}...</h4>
          <StatusBar {...{ progress }} />
        </StatusContainer>
      )}
    </Modal>
  );
};

const Container = styled.div`
  width: 40rem;

  @media screen and (max-width: ${(props) => props.theme.screens.sm}) {
    width: 30rem;
  }
`;

const Controls = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 2.4rem;
  border-radius: 0 0 2px 2px;
  background-color: ${(props) => props.theme.colors.gray[100]};
`;

const InputWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 2.4rem;

  @media screen and (max-width: ${(props) => props.theme.screens.sm}) {
    margin-bottom: 1.6rem;
  }
`;

const CancelButton = styled.button`
  padding: ${(props) => props.theme.spacing.sm}
    ${(props) => props.theme.spacing.md};
  margin-right: 1rem;
  border: 1px solid ${(props) => props.theme.colors.gray[400]};
  border-radius: 2px;
  background-color: #fff;
  font-size: 1.4rem;
  box-shadow: ${(props) => props.theme.boxShadow.sm};

  &:hover {
    cursor: pointer;
    border: 1px solid ${(props) => props.theme.colors.gray[900]};
    box-shadow: ${(props) => props.theme.boxShadow.md};
  }

  &:active {
    border: 1px solid ${(props) => props.theme.colors.red[600]};
  }
`;

const AcceptButton = styled.button`
  padding: ${(props) => props.theme.spacing.sm}
    ${(props) => props.theme.spacing.md};
  border: none;
  border-radius: 2px;
  background-color: ${(props) => props.theme.colors.green[500]};
  color: #fff;
  font-size: 1.4rem;
  box-shadow: ${(props) => props.theme.boxShadow.sm};

  &:hover {
    cursor: pointer;
    background-color: ${(props) => props.theme.colors.green[400]};
  }

  &:active {
    background-color: ${(props) => props.theme.colors.green[500]};
  }
`;

const StatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 3.6rem;
  background-color: #fff;

  & > h4 {
    max-width: 30rem;
    font-size: 2.4rem;
    color: ${(props) => props.theme.colors.gray[800]};
    margin-bottom: 2.4rem;

    @media screen and (max-width: ${(props) => props.theme.screens.sm}) {
      font-size: 1.8rem;
    }
  }
`;

interface ProgressI {
  progress: number;
}

const StatusBar = styled.div<ProgressI>`
  position: relative;
  width: 40rem;
  height: 2.6rem;
  border-radius: 50px;
  background-color: ${(props) => props.theme.colors.gray[300]};
  box-shadow: ${(props) => props.theme.boxShadow.sm};
  overflow: hidden;

  @media screen and (max-width: ${(props) => props.theme.screens.sm}) {
    width: 25rem;
  }

  &::before {
    position: absolute;
    content: '';
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    border-radius: 50px;
    background-color: ${(props) => props.theme.colors.green[600]};
    transform: translateX(${(props) => props.progress}%);
    transition: all ease 0.2s;
  }
`;

export default SaveRouteModal;
