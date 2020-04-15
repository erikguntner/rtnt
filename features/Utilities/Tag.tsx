import React from 'react';
import styled from 'styled-components';
import {
  faUndoAlt,
  faTimes,
  faRedoAlt,
  faMountain,
  faSave,
  faFileDownload,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';

interface TagProps {
  options: string[];
  title: string;
  icon?: IconDefinition;
  handleClick: () => void;
}

const Tag: React.FC<TagProps> = ({ options, title, icon, handleClick }) => {
  return (
    <TagButton selected={options.includes(title)} onClick={handleClick}>
      {icon && <FontAwesomeIcon icon={icon} />}
      <span>{title}</span>
    </TagButton>
  );
};

const TagButton = styled.button<{ selected: boolean }>`
  display: flex;
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
