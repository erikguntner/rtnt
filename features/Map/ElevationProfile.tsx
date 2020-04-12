import React, {
  useEffect,
  useState,
  useRef,
  Dispatch,
  SetStateAction,
  MutableRefObject,
} from 'react';
import styled from 'styled-components';
import ResizeObserver from 'resize-observer-polyfill';
import { createChart } from '../../utils/d3/utils';

interface ElevationData {
  distance: number;
  elevation: number;
}
interface Props {
  showElevation?: boolean | null;
  lines: number[][][];
  elevationData: ElevationData[][];
  units: string;
  setDistanceAlongPath: Dispatch<SetStateAction<number | null>>;
}

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

const ElevationProfile: React.FC<Props> = ({
  showElevation = true,
  lines,
  elevationData,
  units,
  setDistanceAlongPath,
}) => {
  if (!showElevation && showElevation !== null) {
    return null;
  }

  const containerRef = useRef<HTMLDivElement>();
  const svgRef = useRef();
  const dimensions = useResizeObserver(containerRef);

  const removePreviousChart = () => {
    if (containerRef.current.firstElementChild.tagName !== 'P') {
      containerRef.current.firstElementChild.innerHTML = '';
    }
  };

  useEffect(() => {
    if (dimensions === null) return;
    removePreviousChart();
    createChart(elevationData, setDistanceAlongPath, units, dimensions);
  }, [elevationData, dimensions]);

  console.log('elevation data', elevationData);

  return (
    <ChartContainer
      {...{ showElevation }}
      className="line-chart-container"
      id="elevation-container"
      ref={containerRef}
    >
      {lines.length > 0 ? (
        <svg ref={svgRef} className="line-chart" width="100%" height="100%" />
      ) : (
        <Text>Create a line to see the elvation chart</Text>
      )}
    </ChartContainer>
  );
};

const Text = styled.p`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.4rem;
  color: ${(props) => props.theme.colors.gray[600]};
`;

const ChartContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 100%;
  height: 30%;
  background-color: ${(props) => props.theme.colors.gray[100]};
  display: block;
  z-index: 25;
  transition: all 0.3s ease;
`;

export default ElevationProfile;
