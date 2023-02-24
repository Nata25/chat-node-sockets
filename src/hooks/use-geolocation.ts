import { useState } from 'react';

import { geolocationPromisified } from '../helpers/geolocation-promisified.js';

const useGeolocation = () => {
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [geolocationData, setGeolocationData] = useState({});

  const fetchGeolocation = async (onDone: Function) => {
    setLoading(true);
    try {
      const position = await geolocationPromisified();
      const { coords } = position;
      const locationObj = {
        lat: coords.latitude,
        lng: coords.longitude,
      };
      setGeolocationData(locationObj);
      setLoading(false);
      onDone(locationObj);
    } catch (e) {
      console.log('catch', e);
      setError(e);
      console.warn(`Error ocurred: ${e}`);
    }
  }

  return  { isLoading, error, geolocationData, fetchGeolocation };
}

export default useGeolocation;
