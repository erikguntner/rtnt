import React, { useEffect, useRef } from 'react';
import { select, format } from 'd3';
import { sliderTop } from 'd3-simple-slider';
import styled from 'styled-components';
import useResizeObserver from '../Activity/useResizeObserver';
import usePrevious from '../Activity/usePrevious';
import startOfDay from 'date-fns/startOfDay';
import differenceInSeconds from 'date-fns/differenceInSeconds';
import add from 'date-fns/add';
import isEqual from 'date-fns/isEqual';

interface Props {
  max: number;
  handleCustomSlide: (newValue: number[]) => void;
}

interface Dimensions {
  width: number;
  height: number;
}

const CustomSlider: React.FC<Props> = ({ max, handleCustomSlide }) => {
  const containerRef = useRef<HTMLDivElement>();
  const svgRef = useRef();
  const dimensions = useResizeObserver(containerRef);
  const previousDimensions = usePrevious(dimensions);
  const previousMax = usePrevious(max);

  useEffect(() => {
    if (dimensions === null) return;

    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    const height = dimensions.height;
    const width = dimensions.width;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    console.log(max);

    const sliderRange = sliderTop()
      .min(0)
      .max(max)
      .ticks(0)
      .tickFormat(format('.1f'))
      .step(0.5)
      .width(innerWidth - 15)
      .default([0, max])
      .fill('#0070f3')
      .on('onchange', (val) => {
        handleCustomSlide(val);
      });

    console.log(sliderRange);

    const sliderGroup = select('.slider-group');

    sliderGroup.attr('transform', 'translate(15, 40)').call(sliderRange);

    if (previousMax !== max) {
      console.log('different maxes');
      sliderGroup.attr('transform', 'translate(15, 40)').call(sliderRange);
    }
  }, [max, previousMax, dimensions, previousDimensions]);

  return (
    <>
      <ChartContainer id="slider-container" ref={containerRef}>
        <svg ref={svgRef} className="slider" width="100%" height="100%">
          <g width="100%" height="100%" className="slider-group"></g>
        </svg>
      </ChartContainer>
    </>
  );
};

const ChartContainer = styled.div`
  position: relative;
  width: 100%;
  height: 6rem;
  display: block;
  z-index: 25;
  transition: all 0.3s ease;
`;

export default CustomSlider;
