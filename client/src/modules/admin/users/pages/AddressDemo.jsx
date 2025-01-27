import React, { useEffect } from "react";
import axios from "axios";
import { useAddressContext } from "../../../../hooks/AddressContext";

const AddressDemo = () => {
  const {
    formData,
    setFormData,
    countries,
    setCountries,
    states,
    setStates,
    cities,
    setCities,
  } = useAddressContext();

  const API_KEY = "UVp5OThWTkpGSXBjNzNnNXVuODJuOUVydnp3RWlFRmtFVlRsSTNTdA==";

  // Fetch countries on component mount
  useEffect(() => {
    axios
      .get("https://api.countrystatecity.in/v1/countries", {
        headers: { "X-CSCAPI-KEY": API_KEY },
      })
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => console.error("Error fetching countries:", error));
  }, [setCountries]);

  const handleCountryChange = async (iso2) => {
    const selectedCountry = countries.find((c) => c.iso2 === iso2);
    setFormData((prev) => ({
      ...prev,
      country: selectedCountry,
      state: null,
      city: null,
      coordinates: { latitude: "", longitude: "" },
    }));
    setStates([]);
    setCities([]);

    if (iso2) {
      try {
        const response = await axios.get(
          `https://api.countrystatecity.in/v1/countries/${iso2}/states`,
          {
            headers: { "X-CSCAPI-KEY": API_KEY },
          }
        );
        setStates(response.data);
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    }
  };

  const handleStateChange = async (iso2) => {
    const selectedState = states.find((s) => s.iso2 === iso2);
    setFormData((prev) => ({
      ...prev,
      state: selectedState,
      city: null,
      coordinates: { latitude: "", longitude: "" },
    }));
    setCities([]);

    if (iso2 && formData.country?.iso2) {
      try {
        const response = await axios.get(
          `https://api.countrystatecity.in/v1/countries/${formData.country.iso2}/states/${iso2}/cities`,
          {
            headers: { "X-CSCAPI-KEY": API_KEY },
          }
        );
        setCities(response.data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    }
  };

  const handleCityChange = (id) => {
    // Log the city ID to ensure the dropdown is sending the correct value
 
  
    // Ensure cities array is populated correctly
    if (!cities || cities.length === 0) {
      console.error("Cities array is empty or not initialized correctly.");
      return;
    }
  
    // Find the selected city in the cities array
    const selectedCity = cities.find((city) => String(city.id) === String(id));
  
    if (!selectedCity) {
      console.error("City with ID " + id + " not found in the cities array.");
      return;
    }
  

  
    // Update formData with selected city and its coordinates
    const { latitude, longitude } = selectedCity;
    setFormData((prev) => ({
      ...prev,
      city: selectedCity,
      coordinates: { latitude, longitude },
    }));
  };
  

  const handleFormDataChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      coordinates: { ...prev.coordinates, [name]: value },
    }));
  };

  return (
    <div className="container mt-5">
      <form>
        {/* Country Dropdown */}
        <div className="mb-3">
          <label htmlFor="country" className="form-label">
            Country:
          </label>
          <select
            id="country"
            className="form-select"
            value={formData.country?.iso2 || ""}
            onChange={(e) => handleCountryChange(e.target.value)}
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country.iso2} value={country.iso2}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        {/* State Dropdown */}
        {states.length > 0 && (
          <div className="mb-3">
            <label htmlFor="state" className="form-label">
              State:
            </label>
            <select
              id="state"
              className="form-select"
              value={formData.state?.iso2 || ""}
              onChange={(e) => handleStateChange(e.target.value)}
            >
              <option value="">Select State</option>
              {states.map((stateItem) => (
                <option key={stateItem.iso2} value={stateItem.iso2}>
                  {stateItem.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* City Dropdown */}
        {cities.length > 0 && (
          <div className="mb-3">
            <label htmlFor="city" className="form-label">
              City:
            </label>
            <select
              id="city"
              className="form-select"
              value={formData.city?.id || ""}
              onChange={(e) => handleCityChange(e.target.value)}
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Latitude and Longitude */}
        <div className="mb-3">
          <label htmlFor="latitude" className="form-label">
            Latitude:
          </label>
          <input
            type="text"
            id="latitude"
            name="latitude"
            className="form-control mb-2"
            value={formData.coordinates.latitude || ""}
            onChange={handleFormDataChange}
          />
          <label htmlFor="longitude" className="form-label">
            Longitude:
          </label>
          <input
            type="text"
            id="longitude"
            name="longitude"
            className="form-control"
            value={formData.coordinates.longitude || ""}
            onChange={handleFormDataChange}
          />
        </div>
      </form>
    </div>
  );
};

export default AddressDemo;
