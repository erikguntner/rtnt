import React from 'react';
import styled from 'styled-components';
import {
  faWalking,
  faRunning,
  faBiking,
  faMountain,
  faWrench,
  faRoad,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
// import Paved from '../../svg/paved.svg';

interface TagProps {
  options: string[];
  title: string;
  icon?: IconDefinition;
  handleClick: () => void;
}

export const sportsArr = ['run', 'bike', 'walk'];
export const surfacesArr = ['paved', 'unpaved', 'trail'];

export const icons = {
  run: <FontAwesomeIcon icon={faRunning} />,
  bike: <FontAwesomeIcon icon={faBiking} />,
  walk: <FontAwesomeIcon icon={faWalking} />,
  paved: <FontAwesomeIcon icon={faRoad} />,
  unpaved: <FontAwesomeIcon icon={faWrench} />,
  trail: <FontAwesomeIcon icon={faMountain} />,
};

const Tag: React.FC<TagProps> = ({ options, title, icon, handleClick }) => {
  return (
    <TagButton selected={options.includes(title)} onClick={handleClick}>
      <Icon>{icons[title]}</Icon>
      <span>{title}</span>
    </TagButton>
  );
};

const Icon = styled.span`
  font-size: 1.8rem;
`;

const TagButton = styled.button<{ selected: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: 'transparent';
  border: ${({ selected }) => (selected ? '1px solid #0070f3' : 'none')};
  color: ${({ selected }) => (selected ? '#0070f3' : 'black')};
  height: 5.2rem;
  width: 5.2rem;
  border-radius: 2px;
  transition: all 0.2s ease;

  &:not(:last-of-type) {
    margin-right: 1.6rem;
  }

  &:focus {
    outline: none;
    box-shadow: ${(props) => props.theme.boxShadow.outline};
  }

  &:hover {
    cursor: pointer;
    background-color: ${(props) => props.theme.colors.blue[100]};
  }
`;

export default Tag;
