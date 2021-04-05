import React from 'react';
import styled from 'styled-components';

interface PlaceRowProps {
  onClick: () => void;
  displayName: string;
}

const PlaceRow = ({ onClick, displayName }: PlaceRowProps) => {
  const indexOfFirstComma = displayName.indexOf(',');
  const name = displayName.substring(0, indexOfFirstComma);
  const location = displayName.substring(indexOfFirstComma + 1);

  return (
    <Button onClick={onClick}>
      <div>
        <h2>{name}</h2>
        <p>{location}</p>
      </div>
    </Button>
  );
};

const Button = styled.button`
  width: 100%;
  padding: 1.6rem;
  background-color: #fff;
  border: none;
  text-align: left;

  &:hover {
    cursor: pointer;
    background-color: #eee;
  }
`;

export default PlaceRow;
