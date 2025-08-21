import React, { useState } from "react";

const LocationInput = () => {
  const [location, setLocation] = useState("Enter your location...");

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const address = await getAddressFromCoords(latitude, longitude);
          setLocation(address);
        },
        (error) => {
          console.error("Error fetching location:", error);
          alert("Unable to fetch location. Please enable location services.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const getAddressFromCoords = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await response.json();
      return data.display_name || "Location not found";
    } catch (error) {
      console.error("Error fetching address:", error);
      return "Error fetching address";
    }
  };

  return (
    <div>
      <input
        type="text"
        value={location}
        readOnly
        className="px-4 py-2 rounded-lg border"
      />
      <button onClick={getLocation} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg">
        📍 Set Location
      </button>
    </div>
  );
};

export default LocationInput;
