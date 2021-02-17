import { useEffect, useState, useRef, MutableRefObject } from 'react'
import ResizeObserver from 'resize-observer-polyfill';


interface Dimensions {
  boundedHeight: number;
  boundedWidth: number;
  height?: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  marginTop: number;
  width?: number;
}

const combineChartDimensions = (
  dimensions: Partial<Dimensions>
): Dimensions => {
  const parsedDimensions = {
    ...dimensions,
    marginTop: dimensions.marginTop || 30,
    marginRight: dimensions.marginRight || 30,
    marginBottom: dimensions.marginBottom || 30,
    marginLeft: dimensions.marginLeft || 35,
  };
  return {
    ...parsedDimensions,
    boundedHeight: Math.max(
      parsedDimensions.height -
      parsedDimensions.marginTop -
      parsedDimensions.marginBottom,
      0
    ),
    boundedWidth: Math.max(
      parsedDimensions.width -
      parsedDimensions.marginLeft -
      parsedDimensions.marginRight,
      0
    ),
  };
};

export const useChartDimensions = (
  passedSettings = {}
): { ref: MutableRefObject<HTMLDivElement>; newSettings: Dimensions } => {
  const ref = useRef<HTMLDivElement>();
  const dimensions = combineChartDimensions(passedSettings);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      return;
    }

    const element = ref.current;

    const resizeObserver = new ResizeObserver((entries) => {
      if (!Array.isArray(entries)) return;
      if (!entries.length) return;

      const entry = entries[0];

      if (width != entry.contentRect.width) {
        setWidth(entry.contentRect.width);
      }

      if (height != entry.contentRect.height) {
        setHeight(entry.contentRect.height);
      }
    });

    resizeObserver.observe(element);

    return () => resizeObserver.unobserve(element);
  }, []);

  const newSettings = combineChartDimensions({
    ...dimensions,
    width: dimensions.width || width,
    height: dimensions.height || height,
  });

  return { ref, newSettings };
};