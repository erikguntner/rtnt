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
import parseElevationData from '../../utils/parseElevationData';

interface ElevationData {
  distance: number;
  elevation: number;
}
interface Props {
  showElevation?: boolean | null;
  lines: number[][][];
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

    const newElevationData = parseElevationData(lines);

    createChart(newElevationData, setDistanceAlongPath, units, dimensions);
  }, [lines, dimensions]);

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
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #ffff;
  display: block;
  z-index: 25;
  transition: all 0.3s ease;
`;

export default ElevationProfile;
