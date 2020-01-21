import React, { useLayoutEffect } from 'react';
import { CanvasOverlay } from 'react-map-gl';

interface PolylineOverlayProps {
  points: number[][][];
  color?: string;
  lineWidth?: number;
  renderWhileDragging?: boolean;
}

const PolylineOverlay = ({
  points,
  color = 'red',
  lineWidth = 2,
  renderWhileDragging = true,
}: PolylineOverlayProps) => {
  const redraw = ({ width, height, ctx, isDragging, project, unproject }) => {
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'lighter';

    if ((renderWhileDragging || !isDragging) && points) {
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = '#667eea';
      ctx.beginPath();
      points.forEach(arr =>
        arr.forEach(point => {
          const pixel = project([point[0], point[1]]);
          ctx.lineTo(pixel[0], pixel[1]);
        })
      );
      ctx.stroke();
    }
  };

  return <CanvasOverlay redraw={redraw} />;
};

export default PolylineOverlay;
