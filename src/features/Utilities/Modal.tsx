import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
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
          <ModalCard>{children}</ModalCard>
        </ModalWrapper>
      )}
    </Portal>
  );
};

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: hidden;
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
  border-radius: 2px;
  background-color: #fff;
  z-index: 1010;
`;

export default Modal;
