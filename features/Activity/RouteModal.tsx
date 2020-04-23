import React from 'react';
import Modal from '../Utilities/Modal';
import { RouteI } from './ActivityForm';

interface RouteModalProps {
  toggle: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  children: React.ReactNode;
}

const RouteModal: React.FC<RouteModalProps> = ({ toggle, open, children }) => {
  return <Modal {...{ toggle, open }}>{children}</Modal>;
};

export default RouteModal;
