import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import { createPortal } from 'react-dom';
import Portal from './Portal';

interface Props {
  children: React.ReactNode;
  toggle: Dispatch<SetStateAction<boolean>>;
  open: boolean;
}

const Modal: React.FC<Props> = ({ children, toggle, open }) => {
  return (
    <Portal selector={'#portal'}>
      {open && (
        <ModalWrapper>
          <Background onClick={() => toggle(!open)} />
          <ModalCard>
            <div>{children}</div>
            <Controls>
              <CancelButton onClick={() => toggle(!open)}>Close</CancelButton>
              <AcceptButton>Save</AcceptButton>
            </Controls>
          </ModalCard>
        </ModalWrapper>
      )}
    </Portal>
  );
};

const ModalWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: black;
  opacity: 0.4;
`;

const ModalCard = styled.article`
  width: 40rem;
  padding: 2.4rem;
  border-radius: 2px;
  background-color: #fff;
  z-index: 1010;
`;

const Controls = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 2.4rem;
  border-radius: 0 0 2px 2px;
  background-color: ${props => props.theme.colors.gray[200]};
`;

const CancelButton = styled.button`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  margin-right: 1rem;
  border: none;
  border-radius: 2px;
  background-color: transparent;
  color: ${props => props.theme.colors.red[600]};
  font-size: 1.4rem;

  &:hover {
    cursor: pointer;
    background-color: ${props => props.theme.colors.red[300]};
  }

  &:active {
    border: 1px solid ${props => props.theme.colors.red[600]};
  }
`;

const AcceptButton = styled.button`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: none;
  border-radius: 2px;
  background-color: ${props => props.theme.colors.green[500]};
  color: #fff;
  font-size: 1.4rem;

  &:hover {
    cursor: pointer;
    background-color: ${props => props.theme.colors.green[400]};
  }

  &:active {
    background-color: ${props => props.theme.colors.green[500]};
  }
`;

export default Modal;
