import React from 'react';
import styled from 'styled-components';

interface Props {
  showElevation: boolean;
  lines: number[][][];
}

const ElevationProfile: React.FC<Props> = ({ showElevation, lines }) => {



  return (
    <ElevationGraph {...{ showElevation }}>Elevation Profile</ElevationGraph>
  );
};

interface StyleProps {
  showElevation: boolean;
}

const ElevationGraph = styled.div<StyleProps>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 100vw;
  height: 35%;
  background-color: ${props => props.theme.colors.gray[100]};
  display: flex;
  justify-content: center;
  z-index: 10;
  transform: ${props =>
    props.showElevation ? 'translateY(0)' : 'translateY(100%)'};
  transition: all 0.3s ease;
`;

export default ElevationProfile;
