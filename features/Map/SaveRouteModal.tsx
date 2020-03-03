import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Pusher from 'pusher-js';

import { InputWrapper, Input, Label } from '../Forms/styles';
import Modal from '../Utilities/Modal';
import { postRoute } from './routeSlice';
import { RootState } from '../../app/rootReducer';

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface MessageI {
  message: string;
}

const SaveRouteModal: React.FC<Props> = ({ open, setOpen }) => {
  const [value, setValue] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('');

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

    channel.bind('status-update', (data: MessageI) => {
      setStatus(data.message);
    });
  }, []);

  const handleSaveRoute = () => {
    setSaving(true);
    dispatch(
      postRoute({
        authenticated,
        name: value,
        lines,
        elevationData,
        points,
        totalDistance,
        setSaving,
        setOpen,
      })
    );
  };

  return (
    <Modal {...{ open }} toggle={setOpen} onSuccess={handleSaveRoute}>
      {!saving ? (
        <InputWrapper>
          <Label htmlFor="routeName">Route Name</Label>
          <Input
            id="routeName"
            name="routeName"
            type="text"
            placeholder="name"
            value={value}
            onChange={e => setValue(e.target.value)}
          />
        </InputWrapper>
      ) : (
        <h3>{status}</h3>
      )}
    </Modal>
  );
};

export default SaveRouteModal;
