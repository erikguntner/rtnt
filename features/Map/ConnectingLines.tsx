import React from 'react';
import { CanvasOverlay, CanvasRedrawOptions } from 'react-map-gl';

interface ConnectingLinesProps {
  points: number[][];
  endPoint: number[];
  index: number;
  lineWidth?: number;
  renderWhileDragging?: boolean;
}

interface AdditionalTypes {
  isDragging: boolean;
}

type ExtendedCanvasRedrawOptions = CanvasRedrawOptions & AdditionalTypes;

const ConnectingLines = ({
  points,
  endPoint,
  index,
  lineWidth = 2,
  renderWhileDragging = true,
}: ConnectingLinesProps) => {
  const redraw = ({
    width,
    height,
    ctx,
    isDragging,
    project,
  }: ExtendedCanvasRedrawOptions) => {
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'lighter';

    if ((renderWhileDragging || !isDragging) && endPoint.length !== 0) {
      let startPixel = null;
      let endPixel = null;

      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = '#667eea';
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      const pixel = project([endPoint[0], endPoint[1]]);
      if (index === 0) {
        startPixel = project([points[index + 1][0], points[index + 1][1]]);
        endPixel = project([points[index + 1][0], points[index + 1][1]]);
      } else if (index === points.length - 1) {
        startPixel = project([points[index - 1][0], points[index - 1][1]]);
        endPixel = project([points[index - 1][0], points[index - 1][1]]);
      } else {
        startPixel = project([points[index - 1][0], points[index - 1][1]]);
        endPixel = project([points[index + 1][0], points[index + 1][1]]);
      }

      ctx.lineTo(startPixel[0], startPixel[1]);
      ctx.lineTo(pixel[0], pixel[1]);
      ctx.lineTo(endPixel[0], endPixel[1]);
      ctx.stroke();
    }
  };

  return <CanvasOverlay redraw={redraw} />;
};

export default ConnectingLines;
