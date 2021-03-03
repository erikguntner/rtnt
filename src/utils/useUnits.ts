import { useState } from 'react';

type Units = 'miles' | 'kilometers'

export const useUnits = () => {
  const [units, setStoredUnits] = useState<Units>(() => {
    try {
      const units = window.localStorage.getItem('units');
      return units ? JSON.parse(units) : 'miles';
    } catch (error) {
      console.log(error)
      return 'miles'
    }
  });

  const setUnits = (units) => {
    try {
      setStoredUnits(units);
      window.localStorage.setItem('units', JSON.stringify(units));
    } catch (error) {
      console.log(error);
    }
  }

  return [
    units, setUnits
  ]
}
