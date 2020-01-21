import React, { useLayoutEffect } from 'react';
import { CanvasOverlay } from 'react-map-gl';

interface ConnectingLinesProps {
  points: number[][];
  endPoint: number[];
  index: number;
  color?: string;
  lineWidth?: number;
  renderWhileDragging?: boolean;
}

const ConnectingLines = ({
  points,
  endPoint,
  index,
  color = 'red',
  lineWidth = 2,
  renderWhileDragging = true,
}: ConnectingLinesProps) => {
  const redraw = ({ width, height, ctx, isDragging, project, unproject }) => {
    console.log(endPoint, index);
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'lighter';

    if ((renderWhileDragging || !isDragging) && endPoint) {
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = '#667eea';
      ctx.beginPath();
      const pixel = project([endPoint[0], endPoint[1]]);
      const startPixel = project([points[index][0], points[index][1]]);
      ctx.lineTo(startPixel[0], startPixel[1]);
      ctx.lineTo(pixel[0], pixel[1]);
      // points.forEach(arr =>
      //   arr.forEach(point => {
      //     const pixel = project([point[0], point[1]]);
      //     ctx.lineTo(pixel[0], pixel[1]);
      //   })
      // );
      ctx.stroke();
    }
  };

  return <CanvasOverlay redraw={redraw} />;
};

export default ConnectingLines;
