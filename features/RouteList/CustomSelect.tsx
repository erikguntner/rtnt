import React from 'react';
import Select from 'react-select';
import { SelectOption } from './RouteList';

interface CustomSelectProps {
  sortingTerm: string;
  handleSelect: (selectedOption: SelectOption) => void;
}

const customStyles = {
  container: (styles) => ({
    ...styles,
    fontSize: '14px',
  }),
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isFocused ? '#f7fafc' : isSelected ? '#f7fafc' : null,
    color: isFocused ? '#4a5568' : isSelected ? '#1a202c' : '#4a5568',
  }),
};

const options = [
  { value: 'newest', label: 'Sort By: Newest' },
  { value: 'oldest', label: 'Sort By: Oldest' },
  { value: 'shortest', label: 'Sort By: Shortest' },
  { value: 'longest', label: 'Sort By: Longest' },
];

const CustomSelect: React.FC<CustomSelectProps> = ({
  sortingTerm,
  handleSelect,
}) => {
  return (
    <Select
      styles={customStyles}
      theme={(theme) => ({
        ...theme,
        borderRadius: 2,
        colors: {
          ...theme.colors,
          primary: 'rgba(66, 153, 225, 0.5)',
        },
      })}
      defaultValue={options.filter((option) => option.value === sortingTerm)}
      value={options.filter((option) => option.value === sortingTerm)}
      {...{ options }}
      onChange={handleSelect}
    />
  );
};

export default CustomSelect;
