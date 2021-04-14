import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import Router from 'next/router';
import {
  faDownload,
  faEdit,
  faEllipsisH,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import PopOut from '../Utilities/PopOut';
import { getViewport } from '../../utils/getViewport';
import { Route } from './RouteList';
import { setRoute } from '../Map/routeSlice';
import { updateViewport } from '../Map/viewportSlice';
import { downloadGpxFile } from '../../utils/downloadGpxFile';

interface RouteOptionsMenuProps {
  route: Route;
  setDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  units?: 'miles' | 'kilometers';
}

const RouteOptionsMenu = ({
  route,
  units = 'miles',
  setDeleteModal,
}: RouteOptionsMenuProps) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState<boolean>(false);
  const options = useRef<HTMLDivElement>(null);

  const editRoute = () => {
    const { lines, points, start_point, end_point, distance } = route;
    const height = window.innerHeight;
    const width = window.innerWidth;
    const { latitude, longitude, zoom, bearing, pitch } = getViewport(
      width,
      height,
      lines
    );
    dispatch(updateViewport({ latitude, longitude, zoom, bearing, pitch }));
    dispatch(
      setRoute({
        points,
        lines,
        startPoint: start_point,
        endPoint: end_point,
        distance: parseInt(distance),
      })
    );
    Router.push('/');
  };

  const preventBubbling = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
  };

  const handleDownload = (event: React.MouseEvent<HTMLButtonElement>) => {
    preventBubbling(event);
    downloadGpxFile(route.lines, parseInt(route.distance), units);
  };

  const handleDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    preventBubbling(event);
    // deleteRoute(route.id, route.image);
    setDeleteModal(true);
  };

  const handleEdit = (event: React.MouseEvent<HTMLButtonElement>) => {
    preventBubbling(event);
    editRoute();
  };

  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    preventBubbling(event);
    setOpen(!open);
  };

  return (
    <Options ref={options}>
      <OptionsButton onClick={openMenu}>
        <FontAwesomeIcon icon={faEllipsisH} />
      </OptionsButton>
      <PopOut
        motionKey="optionsPopOut"
        parentRef={options}
        {...{ open, setOpen }}
      >
        <button onClick={handleDownload}>
          <FontAwesomeIcon icon={faDownload} />
          Download as GPX
        </button>
        <button onClick={handleEdit}>
          <FontAwesomeIcon icon={faEdit} />
          Edit Route
        </button>
        <button onClick={handleDelete}>
          <FontAwesomeIcon icon={faTrashAlt} />
          Delete Route
        </button>
      </PopOut>
    </Options>
  );
};

const Options = styled.div`
  position: relative;
`;

const OptionsButton = styled.button`
  padding: 0 1.2rem;
  font-size: 1.8rem;
  background-color: #fff;
  border: none;
  border-radius: 2px;

  @media screen and (max-width: ${(props) => props.theme.screens.sm}) {
    font-size: 1.4rem;
  }

  &:hover {
    cursor: pointer;
  }

  &:focus {
    outline: none;
    box-shadow: ${(props) => props.theme.boxShadow.outline};
  }
`;

export default RouteOptionsMenu;
