import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const CityContext = createContext();

export const CityProvider = ({ children }) => {
  const [selectedCity, setSelectedCity] = useState(() => {
    return localStorage.getItem('imovies_city') || 'New York';
  });
  const [cities, setCities] = useState(['New York', 'Los Angeles', 'Chicago', 'San Francisco']);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await api.get('/theatres/cities');
        if (res.data.success && res.data.data.length > 0) {
          setCities(res.data.data);
          if (!res.data.data.includes(selectedCity)) {
            setSelectedCity(res.data.data[0]);
            localStorage.setItem('imovies_city', res.data.data[0]);
          }
        }
      } catch (err) {
        // Fallback default cities already present
      }
    };
    fetchCities();
  }, []);

  const changeCity = (newCity) => {
    setSelectedCity(newCity);
    localStorage.setItem('imovies_city', newCity);
  };

  return (
    <CityContext.Provider value={{ selectedCity, changeCity, cities }}>
      {children}
    </CityContext.Provider>
  );
};

export const useCity = () => {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error('useCity must be used within a CityProvider');
  }
  return context;
};
