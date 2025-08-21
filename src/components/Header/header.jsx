import debounce from "lodash/debounce";
import { MapContainer, TileLayer, Marker, useMapEvents  } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from 'react';
import styles from './header.module.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { useCart } from "../context/CartContext";
import logo from '../../assets/logo.png';
import SearchIcon from '../../assets/search.png';
import AddtoCart from '../../assets/addtocart.png';
import ProfileIcon from '../../assets/signup.png';
import LocationLogo from '../../assets/Location.png';
import MenuIcon from '../../assets/menu.png';
import CloseIcon from '../../assets/close.png';
 

const LocationSelector = ({ onClose, setLocation }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [position, setPosition] = useState([22.5726, 88.3639]);
  const [fullAddress, setFullAddress] = useState("");
  const mapRef = useRef(null);

  const handleSearch = debounce(async (value) => {
    setQuery(value);
    if (value.length > 2) {
      try {
        const res = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${value}&countrycodes=IN`
        );
        setSuggestions(res.data);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  }, 300);

  const handleSelect = async (place) => {
    const lat = parseFloat(place.lat);
    const lon = parseFloat(place.lon);
    setQuery(place.display_name);
    setPosition([lat, lon]);
    setSuggestions([]);
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&countrycodes=IN`
      );
      if (res.data.display_name) {
        setFullAddress(res.data.display_name);
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
    if (mapRef.current) {
      mapRef.current.setView([lat, lon], 13);
    }
  };

  const MapWrapper = () => {
    const map = useMapEvents({});
    useEffect(() => {
      if (!mapRef.current) {
        mapRef.current = map;
      }
    }, [map]);
    return null;
  };

  const handleUseCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
        fetchAddress(latitude, longitude);
      },
      (error) => console.error("Geolocation error:", error),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const fetchAddress = async (lat, lon) => {
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&countrycodes=IN`
      );
      if (res.data.display_name) {
        setQuery(res.data.display_name);
        setFullAddress(res.data.display_name);
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const LocationMarker = () => {
    const map = useMapEvents({
      click(e) {
        const lat = e.latlng.lat;
        const lon = e.latlng.lng;
        setPosition([lat, lon]);
        map.setView([lat, lon], 13);
        fetchAddress(lat, lon);
      },
    });

    return (
      <Marker position={position} icon={L.icon({ iconUrl: LocationLogo, iconSize: [25, 25] })} />
    );
  };

  return (
    <div className={styles.locationPopup}>
      <div className={styles.popupHeader}>
        <h3>Select Location</h3>
        <button onClick={onClose}>✕</button>
      </div>
      <input type="text" value={query} onChange={(e) => handleSearch(e.target.value)} placeholder="Search your location..." className={styles.locationInput} />
      {suggestions.length > 0 && (
        <ul className={styles.suggestionsList}>
          {suggestions.map((place, index) => (
            <li key={index} onClick={() => handleSelect(place)}>{place.display_name}</li>
          ))}
        </ul>
      )}
      <button onClick={handleUseCurrentLocation} className={styles.useLocationBtn}>📍 Use Current Location</button>
      <MapContainer center={position} zoom={13} className={styles.mapContainer} whenCreated={(map) => (mapRef.current = map)}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker />
        <MapWrapper />
      </MapContainer>
      <button onClick={() => { fullAddress ? (setLocation(fullAddress), onClose()) : alert("Please select a location first!"); }} className={styles.confirmBtn}>Confirm Location</button>
    </div>
  );
};

const Header = () => {
  const services = [
    { id: 1, name: "Hire Maid", path: "maid" },
    { id: 2, name: "Hire Cook", path: "cook" },
    { id: 3, name: "Hire Helper", path: "helper" },
    { id: 4, name: "Hire Driver", path: "driver" },
    { id: 5, name: "Laundry & Ironing", path: "laundry" },
    { id: 6, name: "Cleaning", path: "cleaning" }
  ];
  const dropdownRef = useRef(null);
  const { currentUser, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filteredServices, setFilteredServices] = useState([]);
  const { cart } = useCart();
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("Select your location");
  const [location, setLocation] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
   useEffect(() => {
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);


  const handleInputChange = (event) => {
    const value = event.target.value.toLowerCase();
    setQuery(value);
    setFilteredServices(
      value.length > 0 ? services.filter(service => service.name.toLowerCase().includes(value)) : []
    );
  };

  const handleSelectService = (path) => {
    if (!path) {
      console.error("Invalid service path!");
      return;
    }
    navigate(`/products/${path}`);
    setQuery("");
    setFilteredServices([]);
  };

  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setFilteredServices([]);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          if (data && data.display_name) {
            setLocation(data.display_name);
          }
        } catch (error) {
          console.error("Error fetching location data:", error);
        }
      }, (error) => {
        console.error("Geolocation Error:", error);
      });
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className={styles.header}>
      
      <nav className={styles.navigation}>
        <div className={styles.logo}>
          <img src={logo} alt="logo" />
        </div>
        <img 
          src={MenuIcon} 
          alt="Menu" 
          className={styles.menuIcon} 
          onClick={() => setSidebarOpen(true)} 
        />
        <ul className={styles.navLinks}>
          <NavLink to="/" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>Home</NavLink>
          <NavLink to="/products" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>Products</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>About</NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>Contact</NavLink>
        </ul>
      </nav>

      <div className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <img 
          src={CloseIcon} 
          alt="Close" 
          className={styles.closeIcon} 
          onClick={() => setSidebarOpen(false)} 
        />
        <NavLink to="/" className={styles.sidebarLink} onClick={() => setSidebarOpen(false)}>Home</NavLink>
        <NavLink to="/products" className={styles.sidebarLink} onClick={() => setSidebarOpen(false)}>Products</NavLink>
        <NavLink to="/about" className={styles.sidebarLink} onClick={() => setSidebarOpen(false)}>About</NavLink>
        <NavLink to="/contact" className={styles.sidebarLink} onClick={() => setSidebarOpen(false)}>Contact</NavLink>
      </div>

      <div className={styles.LocationBox} onClick={() => setShowLocationModal(true)}>
        <img className={styles.locationlogo} src={LocationLogo} alt="location" />
        <input type="text" className={styles.LocationInput} value={selectedLocation} readOnly />
      </div>
      {showLocationModal && <LocationSelector onClose={() => setShowLocationModal(false)} setLocation={setSelectedLocation} />}

      <div className={styles.search} ref={searchRef}>
        <div className={styles.SearchBox}>
          <img className={styles.HeaderIcon} src={SearchIcon} alt="icon" />
          <input type="text" className={styles.SearchInput} placeholder="Search for a service" value={query} onChange={handleInputChange} />
        </div>
        {filteredServices.length > 0 && (
          <div className={styles.searchSuggestionsContainer}>
            <h4 className={styles.trendingTitle}>Trending Searches</h4>
            <ul className={styles.searchSuggestions}>
              {filteredServices.map(service => (
                <li key={service.id} onClick={() => handleSelectService(service.path)} className={styles.searchSuggestionItem}>
                  {service.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className={styles.addToCart}>
        <NavLink to="/cart" className={styles.cartLink}>
          <img className={styles.CartIcon} src={AddtoCart} alt="cart" />
          {cart.length > 0 && <span className={styles.cartCount}>{cart.length}</span>}
        </NavLink>
      </div>

    {currentUser ? (
  <div className={styles.accountWrapper} ref={dropdownRef}>
    <button
      className={styles.accountButton}
      onClick={() => setShowDropdown(!showDropdown)}
    >
      <img src={ProfileIcon} alt="Profile" className={styles.ProfileIcon} />
      <div className={styles.profileText}>
        <span className={styles.helloText}>Hello,</span>
        <span className={styles.usernameText}>
          {currentUser?.displayName?.split(" ")[0] ||
           currentUser?.phoneNumber?.slice(-6) || 
           "User"}
        </span>
      </div>
    </button>

    {showDropdown && (
      <div className={styles.dropdownMenu}>
        <button onClick={() => { navigate("/account"); setShowDropdown(false); }}>
          👤 My Account
        </button>
        <button onClick={() => { navigate("/orders"); setShowDropdown(false); }}>
          📦 Orders
        </button>
        <button onClick={() => { logout(); setShowDropdown(false); }}>
          🚪 Logout
        </button>
      </div>
    )}
  </div>
) : (
  <NavLink to="/signup" className={styles.accountButton}>
    <img src={ProfileIcon} alt="Sign In" className={styles.ProfileIcon} />
    <div className={styles.profileText}>
      {/* <span className={styles.helloText}>Hello,</span> */}
      <span className={styles.usernameText}>Sign In</span>
    </div>
  </NavLink>
)}


    </header>
  );
};

export default Header;
