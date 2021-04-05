import React, { useContext } from 'react';
import styled from 'styled-components';
import { Marker, _useMapControl as useMapControl } from 'react-map-gl';

interface AddDestinationMarkerProps {
  location: number[];
  cancel: () => void;
  addToRoute: () => void;
}

const AddDestinationMarker = ({
  location,
  cancel,
  addToRoute,
}: AddDestinationMarkerProps) => {
  const [longitude, latitude] = location;

  return (
    <Marker captureClick={false} longitude={longitude} latitude={latitude}>
      <MarkerWrapper>
        <Buttons>
          <button
            onClick={(event) => {
              event.stopPropagation();
              cancel();
            }}
          >
            Cancel
          </button>
          <button onClick={addToRoute}>Add to route</button>
        </Buttons>
        <Circle></Circle>
      </MarkerWrapper>
    </Marker>
  );
};
const MarkerWrapper = styled.div`
  position: relative;
`;

const Circle = styled.div`
  height: 1.6rem;
  width: 1.6rem;
  background-color: ${(props) => props.theme.colors.primary};
  border: 2px solid #fff;
  border-radius: 50%;
  box-shadow: ${(props) => props.theme.boxShadow.sm};
`;

const Buttons = styled.div`
  position: absolute;
  left: 50%;
  top: -9px;
  display: flex;
  transform: translateX(-50%) translateY(-99%);

  button {
    width: 10rem;
    background-color: rgba(51, 51, 51, 0.9);
    border: none;
    padding: 8px 0;
    color: #fff;

    &:hover {
      cursor: pointer;
      background-color: rgba(51, 51, 51, 0.85);
    }

    &:first-of-type {
      position: relative;
      color: red;
      border-radius: 3px 0 0 3px;

      &::after {
        content: '';
        position: absolute;
        right: 0;
        top: 8px;
        height: calc(100% - 16px);
        width: 1px;
        background-color: rgba(255, 255, 255, 0.3);
      }
    }

    &:last-of-type {
      border-radius: 0 3px 3px 0;
    }
  }

  &::before {
    content: '';
    position: absolute;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-top: 6px solid rgba(51, 51, 51, 0.9);
    bottom: -5px;
    left: 87px;
    z-index: 1090;
    left: 50%;
    transform: translate3d(-50%, 10%, 0);
  }
`;
export default AddDestinationMarker;
