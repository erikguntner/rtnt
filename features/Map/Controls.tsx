import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { ActionCreators } from 'redux-undo';
import {
  faUndoAlt,
  faTimes,
  faRedoAlt,
  faMountain,
  faRoute,
  faDrawPolygon,
  faSave,
} from '@fortawesome/free-solid-svg-icons';

import ControlButton from './ControlButton';

import { RootState } from '../../app/rootReducer';
import { clearRoute } from './routeSlice';

interface Props {
  clipPath: boolean;
  showElevation: boolean;
  setClipPath: Dispatch<SetStateAction<boolean>>;
  setShowElevation: Dispatch<SetStateAction<boolean>>;
}

const Controls: React.FC<Props> = ({
  setClipPath,
  clipPath,
  showElevation,
  setShowElevation,
}) => {
  const dispatch = useDispatch();
  const { points } = useSelector((state: RootState) => ({
    points: state.route.present.points,
  }));

  return (
    <ControlsContainer>
      <ControlButton
        disabled={!points.length}
        handleClick={() => dispatch(ActionCreators.undo())}
        icon={faUndoAlt}
        tooltip={'undo'}
      />
      <ControlButton
        disabled={!points.length}
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
      {/* <ControlButton
        click={() => changeToClipPath(true)}
        icon={faRoute}
        activeState={clipPath}
        tooltip={'clip path'}
      /> */}
      {/* <ControlButton
        click={() => changeToClipPath(false)}
        icon={faDrawPolygon}
        activeState={!clipPath}
        tooltip={'linear'}
      /> */}
      {/* <ControlButton
        disabled={!geoJSONLines.features.length}
        click={e => this.checkForDisabled(e, this.toggleModal)}
        icon={faSave}
        tooltip={'save route'}
      /> */}
      {/* <Modal open={this.state.open} toggle={this.toggleModal}>
        <SaveRoute
          toggleModal={this.toggleModal}
          saveRoute={saveRoute}
          routeData={routeData}
        />
      </Modal> */}
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
`;

export default Controls;
