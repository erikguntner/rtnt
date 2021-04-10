import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { debounce } from 'lodash';

import PlaceRow from './PlaceRow';
import Spinner from './Spinner';

interface Place {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  boundingbox: string[];
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
  icon?: string;
}

interface GeocodeSearchProps {
  locateSearchDestination: (location: number[]) => void;
}

const fetchPlaces = async (query: string): Promise<Place[]> => {
  const response = await window.fetch(
    `https://nominatim.openstreetmap.org/search?q=${query}&limit=5&format=json`
  );

  const data: Place[] = await response.json();

  if (response.ok) {
    return data;
  } else {
    return Promise.reject(new Error('there was an error fetching places'));
  }
};

const GeocodeSearch = ({ locateSearchDestination }: GeocodeSearchProps) => {
  const [value, setValue] = useState<string>('');
  const [places, setPlaces] = useState<Place[]>([]);
  const [queried, setQueried] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const getPlaces = useCallback(
    debounce(async (query: string) => {
      if (query.length) {
        setQueried(true);
        setLoading(true);
        
        try {
          const places = await fetchPlaces(query);
          setPlaces(places);
          setLoading(false);
        } catch (err) {
          console.log(err);
          setLoading(false);
        }
      } else {
        setQueried(false);
        setPlaces([]);
      }
    }, 500),
    []
  );

  const onInputChange = (e) => {
    const value = e.target.value;
    setValue(value);
    getPlaces(value);
  };

  return (
    <Wrapper>
      <Input
        onChange={onInputChange}
        id="search"
        type="text"
        value={value}
        placeholder="Search for location"
        autoComplete="off"
      />
      {places.length ? (
        <PlacesList>
          {places.map(({ display_name, lat, lon }: Place) => {
            return (
              <li key={display_name} aria-label={display_name}>
                <PlaceRow
                  onClick={() => {
                    locateSearchDestination([parseFloat(lon), parseFloat(lat)]);
                    setValue('');
                    setQueried(false);
                    setPlaces([]);
                  }}
                  displayName={display_name}
                />
              </li>
            );
          })}
        </PlacesList>
      ) : queried ? (
        !loading && (
          <Box>
            <h2>Sorry we couldn't find anything</h2>
          </Box>
        )
      ) : null}
      {loading && (
        <SpinnerWrapper>
          <Spinner />
        </SpinnerWrapper>
      )}
    </Wrapper>
  );
};

const SpinnerWrapper = styled.div`
  position: absolute;
  right: 0;
  top: -4px;
  height: 100%;
  display: flex;
  align-items: center;
  margin-right: 16px;
`;

const Wrapper = styled.div`
  position: relative;
  flex: 1;
  height: 100%;

  @media screen and (max-width: ${(props) => props.theme.screens.md}) {
    display: none;
  }
`;

const Input = styled.input`
  width: 100%;
  height: 100%;
  border: none;
  background-color: #eee;
  padding-left: 1.6rem;
  padding-right: 4rem;
`;

const PlacesList = styled.ul`
  position: absolute;
  top: 5.6rem;
  right: 0;
  width: 100%;
  min-width: 40rem;

  li {
    list-style: none;
    width: 100%;

    &:not(:last-of-type) {
      border-bottom: 1px solid lightgray;
    }
  }
`;

const Box = styled.div`
  position: absolute;
  top: 5.6rem;
  left: 0;
  width: 100%;
  padding: 1.6rem;
  background-color: #fff;
`;

export default GeocodeSearch;
