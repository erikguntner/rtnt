import React, {
  useEffect,
  useState,
  useRef,
  Dispatch,
  SetStateAction,
  MutableRefObject,
} from 'react';
import ResizeObserver from 'resize-observer-polyfill';

/**
 * Hook, that returns the current dimensions of an HTML element.
 * Doesn't play well with SVG.
 */

interface Dimensions {
  width: number;
  height: number;
}

const useResizeObserver = (
  ref: MutableRefObject<HTMLDivElement>
): Dimensions => {
  const [dimensions, setDimensions] = useState<Dimensions | null>(null);

  useEffect(() => {
    const observerTarget = ref.current;
    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });
    resizeObserver.observe(observerTarget);
    return () => {
      resizeObserver.unobserve(observerTarget);
    };
  }, [ref]);
  return dimensions;
};

export default useResizeObserver;
