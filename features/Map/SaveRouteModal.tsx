import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { InputWrapper, Input, Label } from '../Forms/styles';
import Modal from '../Utilities/Modal';
import { postRoute } from './routeSlice';
import { RootState } from '../../app/rootReducer';

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SaveRouteModal: React.FC<Props> = ({ open, setOpen }) => {
  const [value, setValue] = useState<string>('');

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

  return (
    <Modal
      {...{ open }}
      toggle={setOpen}
      onSuccess={() =>
        dispatch(
          postRoute({
            authenticated,
            name: value,
            lines,
            elevationData,
            points,
            totalDistance,
          })
        )
      }
    >
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
    </Modal>
  );
};

export default SaveRouteModal;
