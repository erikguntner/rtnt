import React, { useState, Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { ActionCreators } from 'redux-undo';
import {
  faUndoAlt,
  faTimes,
  faRedoAlt,
  faMountain,
  faSave,
  faFileDownload,
} from '@fortawesome/free-solid-svg-icons';

import ControlButton from './ControlButton';
import SaveRouteModal from './SaveRouteModal';

import { RootState } from '../../app/rootReducer';
import { clearRoute } from './routeSlice';
import { createGPXFile } from '../../utils/createGPXFile';

interface Props {
  clipPath: boolean;
  showElevation: boolean;
  setClipPath: Dispatch<SetStateAction<boolean>>;
  setShowElevation: Dispatch<SetStateAction<boolean>>;
}

const Controls: React.FC<Props> = ({ showElevation, setShowElevation }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  const dispatch = useDispatch();
  const { points, future, past, authenticated } = useSelector(
    (state: RootState) => ({
      points: state.route.present.points,
      future: state.route.future,
      past: state.route.past,
      authenticated: state.auth.authenticated,
    })
  );

  const downloadGPXFile = () => {
    const data = createGPXFile();
    const blob = new Blob([data]);
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.download = 'test.gpx';
    link.href = url;
    document.body.appendChild(link); // Required for this to work in FireFox
    link.click();
  };

  const isAuthenticated: boolean =
    points.length < 2
      ? true
      : authenticated === '' || saving === true
      ? true
      : false;

  return (
    <ControlsContainer>
      <ControlButton
        disabled={!past.length}
        handleClick={() => dispatch(ActionCreators.undo())}
        icon={faUndoAlt}
        tooltip={'undo'}
      />
      <ControlButton
        disabled={!future.length}
        handleClick={() => dispatch(ActionCreators.redo())}
        icon={faRedoAlt}
        tooltip={'redo'}
      />
      <ControlButton
        disabled={!points.length}
        handleClick={() => dispatch(clearRoute())}
        icon={faTimes}
        tooltip={'clear route'}
      />
      <ControlButton
        handleClick={() => setShowElevation(!showElevation)}
        icon={faMountain}
        activeState={showElevation}
        tooltip={'elevation'}
      />
      <ControlButton
        disabled={isAuthenticated}
        handleClick={() => setOpen(!open)}
        icon={faSave}
        tooltip={'save route'}
      />
      <ControlButton
        disabled={points.length < 2}
        handleClick={downloadGPXFile}
        icon={faFileDownload}
        tooltip={'export as gpx'}
      />
      {/* <ControlButton
        handleClick={() =>
          dispatch(
            changeNotificationStatus({
              isVisible: true,
              type: 'success',
              message: 'this is a message',
            })
          )
        }
        icon={faRoute}
        tooltip={'clip path'}
      /> */}
      {/* <ControlButton
        click={() => changeToClipPath(false)}
        icon={faDrawPolygon}
        activeState={!clipPath}
        tooltip={'linear'}
      /> */}
      <SaveRouteModal {...{ open, setOpen, saving, setSaving }} />
    </ControlsContainer>
  );
};

const ControlsContainer = styled.div`
  position: absolute;
  top: 8rem;
  left: 0;
  right: 0;
  margin: 0 auto;
  max-width: min-content;
  display: flex;
  justify-content: center;
  z-index: 10;

  @media screen and (max-width: 800px) {
    max-width: 90%;
  }

  @media screen and (max-width: 600px) {
    max-width: calc(100% - 2.4rem);
    padding: 0 1.2px;
    top: calc(1.2rem + ${(props) => props.theme.navHeight});
  }
`;

export default Controls;
