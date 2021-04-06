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
  faLevelUpAlt,
  faExpandArrowsAlt,
} from '@fortawesome/free-solid-svg-icons';

import ControlButton from './ControlButton';
import SaveRouteModal from './SaveRouteModal';
import GeocodeSearch from './GeocodeSearch';

import { RootState } from '../../reducers/rootReducer';
import { clearRoute, outAndBack } from './routeSlice';
import { updateViewport } from './viewportSlice';
import { downloadGpxFile } from '../../utils/downloadGpxFile';
import { getViewport } from '../../utils/getViewport';

interface Props {
  clipPath: boolean;
  showElevation: boolean;
  setClipPath: Dispatch<SetStateAction<boolean>>;
  setShowElevation: Dispatch<SetStateAction<boolean>>;
  locateSearchDestination: (location: number[]) => void;
}

const Controls: React.FC<Props> = ({
  showElevation,
  setShowElevation,
  locateSearchDestination,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  const dispatch = useDispatch();
  const {
    distance,
    lines,
    points,
    future,
    past,
    authenticated,
    units,
  } = useSelector((state: RootState) => ({
    distance: state.route.present.distance,
    lines: state.route.present.lines,
    points: state.route.present.points,
    future: state.route.future,
    past: state.route.past,
    authenticated: state.auth.authenticated,
    units: state.auth.user.units,
  }));

  const isAuthenticated: boolean =
    points.length < 2
      ? true
      : authenticated === '' || saving === true
      ? true
      : false;

  const handleOutAndBack = (points, lines) => {
    const reversedPoints = points.slice(0, -1).reduce((accum, curr) => {
      accum.unshift(curr);
      return accum;
    }, []);

    const reversedLines = lines
      .reduce((accum, curr) => {
        accum.unshift(curr);
        return accum;
      }, [])
      .map((line) =>
        line.reduce((accum, curr) => {
          accum.unshift(curr);
          return accum;
        }, [])
      );

    dispatch(outAndBack({ reversedPoints, reversedLines }));
  };

  const fitToViewport = (lines) => {
    const height = window.innerHeight;
    const width = window.innerWidth;
    const { latitude, longitude, zoom, bearing, pitch } = getViewport(
      height,
      width,
      lines
    );
    dispatch(updateViewport({ latitude, longitude, zoom, bearing, pitch }));
  };

  return (
    <ControlsContainer>
      <ControlButton
        disabled={!past.length}
        handleClick={() => dispatch(ActionCreators.undo())}
        icon={faUndoAlt}
        tooltip={'undo'}
        id={'undo'}
      />
      <ControlButton
        disabled={!future.length}
        handleClick={() => dispatch(ActionCreators.redo())}
        icon={faRedoAlt}
        tooltip={'redo'}
        id={'redo'}
      />
      <ControlButton
        disabled={!points.length}
        handleClick={() => dispatch(clearRoute())}
        icon={faTimes}
        tooltip={'clear route'}
        id={'clear'}
      />
      <ControlButton
        disabled={!lines.length}
        handleClick={() => handleOutAndBack(points, lines)}
        icon={faLevelUpAlt}
        rotate={-90}
        tooltip={'out and back'}
        id={'out-and-back'}
      />
      <ControlButton
        disabled={points.length < 2}
        handleClick={() => fitToViewport(lines)}
        icon={faExpandArrowsAlt}
        tooltip={'fit to screen'}
        id={'fit'}
      />
      <ControlButton
        handleClick={() => setShowElevation(!showElevation)}
        icon={faMountain}
        activeState={showElevation}
        tooltip={'elevation'}
        id={'elevation'}
      />
      <ControlButton
        disabled={isAuthenticated}
        handleClick={() => setOpen(!open)}
        icon={faSave}
        tooltip={'save route'}
        id={'save'}
      />
      <ControlButton
        disabled={points.length < 2}
        handleClick={() => downloadGpxFile(lines, distance, units)}
        icon={faFileDownload}
        tooltip={'export as gpx'}
        id={'gpx'}
      />
      <GeocodeSearch locateSearchDestination={locateSearchDestination} />
      <SaveRouteModal {...{ open, setOpen, saving, setSaving }} />
    </ControlsContainer>
  );
};

const ControlsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  flex: 1;
  z-index: 10;
`;

export default Controls;
