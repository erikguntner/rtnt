import React, { useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

interface PopOutProps {
  motionKey: string;
  children: ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  parentRef: React.MutableRefObject<HTMLLIElement | HTMLDivElement>;
}

// const useKeyPress = function (targetKey) {
//   const [keyPressed, setKeyPressed] = useState(false);

//   function downHandler({ key }) {
//     if (key === targetKey) {
//       setKeyPressed(true);
//     }
//   }

//   const upHandler = ({ key }) => {
//     if (key === targetKey) {
//       setKeyPressed(false);
//     }
//   };

//   React.useEffect(() => {
//     window.addEventListener('keydown', downHandler);
//     window.addEventListener('keyup', upHandler);

//     return () => {
//       window.removeEventListener('keydown', downHandler);
//       window.removeEventListener('keyup', upHandler);
//     };
//   });

//   return keyPressed;
// };

const PopOut: React.FC<PopOutProps> = ({
  motionKey,
  children,
  open,
  setOpen,
  parentRef,
}) => {
  // const [cursor, setCursor] = useState<number>(0);
  // const downPress = useKeyPress('ArrowDown');
  // const upPress = useKeyPress('ArrowUp');

  // const handleArrowPress = (e) => {
  //   if (e.key === 'ArrowUp') {
  //     console.log('arrow up');
  //   } else if (e.key === 'ArrowDown') {
  //     console.log('arrow down');
  //   }
  // };

  const handleClick = (e) => {
    if (parentRef.current) {
      if (parentRef.current.contains(e.target)) {
        // inside click
        return;
      }

      setOpen(false);
    }
  };

  useEffect(() => {
    // add when mounted
    document.addEventListener('mousedown', handleClick);
    // document.addEventListener('keydown', handleArrowPress);
    // return function to be called when unmounted
    return () => {
      document.removeEventListener('mousedown', handleClick);
      // document.removeEventListener('keydown', handleArrowPress);
    };
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <PopOutWrapper
          key={motionKey}
          initial={{
            opacity: 0,
            scale: 0.95,
            translateY: '100%',
            transformOrigin: 'top right',
          }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{
            opacity: { duration: 0.2 },
            scale: { duration: 0.2 },
          }}
        >
          {children}
        </PopOutWrapper>
      )}
    </AnimatePresence>
  );
};

const PopOutWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 15rem;
  padding: 1.4rem 0;
  background-color: #fff;
  border-radius: 2px;
  z-index: 2000;
  color: black;
  box-shadow: ${(props) => props.theme.boxShadow.lg};
  overflow: hidden;

  & a {
    text-decoration: none;
  }

  & a,
  button {
    display: block;
    border: none;
    background-color: transparent;
    width: 100%;
    text-align: left;
    padding: 4px 12px;
    color: ${(props) => props.theme.colors.gray[600]};
    font-size: 1.4rem;

    &:hover,
    &:focus {
      background-color: ${(props) => props.theme.colors.gray[300]};
    }
  }
`;

export default PopOut;
