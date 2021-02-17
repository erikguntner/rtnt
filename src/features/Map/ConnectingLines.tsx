import React from 'react';
import { CanvasOverlay } from 'react-map-gl';

interface ConnectingLinesProps {
  points: number[][];
  index: number;
  lineWidth?: number;
  renderWhileDragging?: boolean;
}

interface AdditionalTypes {
  isDragging: boolean;
}

const ConnectingLines = ({
  points,
  index,
  lineWidth = 2,
  renderWhileDragging = true,
}: ConnectingLinesProps) => {
  const redraw = ({ width, height, ctx, isDragging, project }) => {
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'lighter';

    if (renderWhileDragging || !isDragging) {
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = '#667eea';
      ctx.setLineDash([10, 10]);
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      const pixel = project([points[index][0], points[index][1]]);
      
      const startPixel =
        index === 0
          ? project([points[index + 1][0], points[index + 1][1]])
          : index === points.length - 1
          ? project([points[index - 1][0], points[index - 1][1]])
          : project([points[index - 1][0], points[index - 1][1]]);
      const endPixel =
        index === 0
          ? project([points[index + 1][0], points[index + 1][1]])
          : index === points.length - 1
          ? project([points[index - 1][0], points[index - 1][1]])
          : project([points[index + 1][0], points[index + 1][1]]);

      ctx.lineTo(startPixel[0], startPixel[1]);
      ctx.lineTo(pixel[0], pixel[1]);
      ctx.lineTo(endPixel[0], endPixel[1]);
      ctx.stroke();
    }
  };

  return <CanvasOverlay redraw={redraw} />;
};

export default ConnectingLines;
