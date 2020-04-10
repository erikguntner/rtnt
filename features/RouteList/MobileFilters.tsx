import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Portal from '../Utilities/Portal';
import Slider from '@material-ui/core/Slider';

import {
  FilterGroup,
  Label,
  InputWrapper,
  InputWithIcon,
  InputGroup,
  FiltersTypes,
  SelectOption,
} from './RouteList';
import styled from 'styled-components';
import CustomSelect from './CustomSelect';

interface MobileFiltersProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  filters: FiltersTypes;
  sortingTerm: string;
  maxDistance: number;
  handleChange: (filter, value) => void;
  handleSelect: (selectedOption: SelectOption) => void;
  handleSlide: (
    event: React.ChangeEvent<{}>,
    newValue: number[],
    filters: FiltersTypes
  ) => void;
}

const MobileFilters: React.FC<MobileFiltersProps> = ({
  open,
  setOpen,
  handleChange,
  filters,
  sortingTerm,
  handleSelect,
  maxDistance,
  handleSlide,
}) => {
  return (
    <Portal selector={'#portal'}>
      {open && (
        <Filters>
          <CloseButton onClick={() => setOpen(false)}>X</CloseButton>
          <SelectContainer>
            <CustomSelect {...{ sortingTerm, handleSelect }} />
          </SelectContainer>
          <FilterGroup>
            <Label>Keyword</Label>
            <InputWrapper>
              <FontAwesomeIcon icon={faSearch} />
              <InputWithIcon
                onChange={(e) => handleChange('keyword', e.target.value)}
                value={filters.keyword}
                type="text"
                placeholder="Filter by keyword"
              />
            </InputWrapper>
          </FilterGroup>
          <FilterGroup>
            <Label>Distance</Label>
            <InputGroup>
              <Slider
                min={0}
                step={0.5}
                max={maxDistance}
                onChange={(event: React.ChangeEvent<{}>, newValue: number[]) =>
                  handleSlide(event, newValue, filters)
                }
                value={[filters.distance[0], filters.distance[1]]}
              />
            </InputGroup>
          </FilterGroup>
        </Filters>
      )}
    </Portal>
  );
};

export default MobileFilters;

const CloseButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  margin: 2rem;
  border: none;
  background: transparent;
  font-size: 2rem;
`;

const SelectContainer = styled.div`
  width: 75%;
  margin-top: 5rem;
  margin-bottom: 2.4rem;
  z-index: 2000;
  border-radius: 2px;

  @media screen and (max-width: ${(props) => props.theme.screens.sm}) {
    width: 90%;
  }
`;

export const Filters = styled.div`
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  z-index: 1000;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 2.4rem;
  background-color: #fff;

  @media screen and (max-width: ${(props) => props.theme.screens.md}) {
    display: flex;
  }
`;
