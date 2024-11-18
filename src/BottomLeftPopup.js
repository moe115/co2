import React, { useState ,useEffect} from "react";


const BottomLeftPopup = () => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      {/* Toggle button to show the pop-up */}
      <button onClick={() => setIsVisible(!isVisible)} style={toggleButtonStyle}>
     how
      </button>

      {/* The pop-up itself */}
      {isVisible && (
        <div style={popupStyle}>
        <p>To calculate the CO₂ emitted per flight, we multiplied the total distance between two airports by the average CO₂ emission per passenger per kilometer.

To determine the average CO₂ emitted per passenger per kilometer, we analyzed a high-level dataset compiled by researchers at ISAE-SUPAERO Toulouse https://zenodo.org/records/10143773. Based on this dataset, we found that the average CO₂ emission is 100 g/km per passenger for wide-body and narrow-body airplanes, and 150 g/km per passenger for regional aircraft.

In our calculations, every flight under 500 km is assumed to be a regional flight, while flights over 500 km are considered long-haul flights.

To calculate the distance between two airports, we used the Geolib library, which takes the longitude and latitude of two locations and returns the distance. For airport names and locations, we relied on the Airport-JSON library.

Enjoy!</p>
<button onClick={() => setIsVisible(false)} style={buttonStyle}>
            Close
          </button>
        </div>
      )}
    </>
  );
};

const popupStyle = {
  position: "fixed",
  bottom: "10px",
  left: "10px",
  backgroundColor: "white",
  border: "1px solid #ccc",
  borderRadius: "5px",
  padding: "10px",
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
};

const buttonStyle = {
  marginTop: "10px",
  padding: "5px 10px",
  backgroundColor: "grey",
  color: "white",
  border: "none",
  borderRadius: "3px",
  cursor: "pointer",
};

const toggleButtonStyle = {
  position: "fixed",
  top: "10px",
  left: "10px",
  padding: "5px 10px",
  backgroundColor: "grey",
  color: "white",
  border: "none",
  borderRadius: "3px",
  cursor: "pointer",

};

export default BottomLeftPopup;