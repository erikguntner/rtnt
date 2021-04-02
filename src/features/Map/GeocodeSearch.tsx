import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { debounce } from 'lodash';

const GeocodeSearch = () => {
  const [value, setValue] = useState<string>('');

  const getPlaces = useCallback(
    debounce((query) => {
      window
        .fetch(
          `https://cors-anywhere.herokuapp.com/https://nominatim.openstreetmap.org/search?q=${query}`
        )
        .then((response) => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          console.log(response.json());
        })
        .catch((err) => console.error(err));
    }, 1000),
    []
  );

  const onInputChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    getPlaces(newValue);
  };

  return (
    <Wrapper>
      <Input
        onChange={onInputChange}
        id="search"
        type="text"
        value={value}
        placeholder="Search for location"
      />
      <div></div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  flex: 1;
  height: 100%;
`;

const Input = styled.input`
  width: 100%;
  height: 100%;
  border: none;
  background-color: #eee;
  padding-left: 1.6rem;
`;

export default GeocodeSearch;
