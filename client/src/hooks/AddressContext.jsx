import React, { createContext, useState, useContext } from "react";

// Create the context
const AddressContext = createContext();

// Context provider
export const AddressProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    country: null,
    state: null,
    city: null,
    coordinates: { latitude: "", longitude: "" },
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  return (
    <AddressContext.Provider
      value={{
        formData,
        setFormData,
        countries,
        setCountries,
        states,
        setStates,
        cities,
        setCities,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};

// Custom hook for using the context
export const useAddressContext = () => useContext(AddressContext);
