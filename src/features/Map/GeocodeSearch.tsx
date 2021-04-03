import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { debounce } from 'lodash';

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

const fetchPlaces = async (query: string): Promise<Place[]> => {
  const response = await window.fetch(
    `https://nominatim.openstreetmap.org/search?q=${query}&format=json`
  );

  const data: Place[] = await response.json();

  if (response.ok) {
    return data;
  } else {
    return Promise.reject(new Error('there was an error fetching places'));
  }
};

const GeocodeSearch = () => {
  const [value, setValue] = useState<string>('');
  const [places, setPlaces] = useState<Place[]>([]);
  const [queried, setQueried] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const getPlaces = useCallback(
    debounce(async (query: string) => {
      if (query.length) {
        setQueried(true);
        setLoading(true);

        const places = await fetchPlaces(query);

        setPlaces(places);
        setLoading(false);
      } else {
        setQueried(false);
        setPlaces([]);
      }
    }, 700),
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
          {places.map((place: Place, i) => (
            <li key={place.display_name} aria-label={place.display_name}>
              <button>
                <div>
                  <h2>{place.display_name}</h2>
                </div>
              </button>
            </li>
          ))}
        </PlacesList>
      ) : queried ? (
        <Box>
          {loading ? <p>Loading</p> : <p>Sorry we couldn't find anything</p>}
        </Box>
      ) : null}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
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

const PlacesList = styled.ul`
  position: absolute;
  top: 5.6rem;
  left: 0;
  max-height: 40rem;
  width: 100%;
  overflow: scroll;

  li {
    list-style: none;
    width: 100%;

    &:not(:last-of-type) {
      border-bottom: 1px solid lightgray;
    }

    button {
      width: 100%;
      padding: 1.6rem;
      background-color: #fff;
      border: none;
      text-align: left;

      &:hover {
        cursor: pointer;
        background-color: #eee;
      }
    }
  }
`;

const Box = styled.div`
  position: absolute;
  top: 5.6rem;
  left: 0;
  padding: 1.6rem;
  background-color: #fff;
`;

export default GeocodeSearch;
