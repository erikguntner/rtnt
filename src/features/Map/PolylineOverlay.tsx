import React from 'react';
import { CanvasOverlay, CanvasRedrawOptions } from 'react-map-gl';

interface AdditionalTypes {
  isDragging: boolean;
}

type ExtendedCanvasRedrawOptions = CanvasRedrawOptions & AdditionalTypes;

interface PolylineOverlayProps {
  points: number[][][];
  color?: string;
  lineWidth?: number;
  renderWhileDragging?: boolean;
}

const PolylineOverlay = ({
  points,
  lineWidth = 2,
  renderWhileDragging = true,
}: PolylineOverlayProps) => {
  const redraw = ({
    width,
    height,
    ctx,
    isDragging,
    project,
  }: ExtendedCanvasRedrawOptions) => {
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
