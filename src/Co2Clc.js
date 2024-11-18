import React, { useState } from 'react';
import airports from 'airports-json';
import { getDistance } from 'geolib';
 import './Co2.css';

 

const AirportDistanceCalculator = () => {
  const [selectedAirport1, setSelectedAirport1] = useState(null);
  const [selectedAirport2, setSelectedAirport2] = useState(null);
  const [transitAirports, setTransitAirports] = useState([]);
  const [segmentDistances, setSegmentDistances] = useState([]);
  const [totalDistance, setTotalDistance] = useState(null);
  const [totalCo2, setTotalCo2] = useState(null);

  const sortedAirports = [...airports.airports].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const handleSelect1 = (e) => {
    const airport = JSON.parse(e.target.value);
    setSelectedAirport1(airport);
  };

  const handleSelect2 = (e) => {
    const airport = JSON.parse(e.target.value);
    setSelectedAirport2(airport);
  };

  const handleAddTransitAirport = () => {
    setTransitAirports([...transitAirports, null]);
  };

  const handleTransitSelect = (e, index) => {
    const airport = JSON.parse(e.target.value);
    const updatedTransitAirports = [...transitAirports];
    updatedTransitAirports[index] = airport;
    setTransitAirports(updatedTransitAirports);
  };

  const calculateDistances = () => {
    if (selectedAirport1 && selectedAirport2) {
      const allAirports = [selectedAirport1, ...transitAirports.filter(Boolean), selectedAirport2];
      let total = 0;
      let totalCo2Emissions = 0; // To accumulate total CO2 emissions
      const segments = [];

      for (let i = 0; i < allAirports.length - 1; i++) {
        const segmentDistance = getDistance(
          { latitude: parseFloat(allAirports[i].latitude_deg), longitude: parseFloat(allAirports[i].longitude_deg) },
          { latitude: parseFloat(allAirports[i + 1].latitude_deg), longitude: parseFloat(allAirports[i + 1].longitude_deg) }
        ) / 1000; // Convert to kilometers

        total += segmentDistance;

        // Calculate CO2 emissions for this segment
        let co2Emissions = 0;
        let planeType = "";
        if (segmentDistance < 500) {
          planeType = "Regional Jet";
          co2Emissions = segmentDistance * 0.15; // 150g CO2 per km

        } else {
          planeType = "Widebody/norrowbody Jet";
          co2Emissions = segmentDistance * 0.10; // 100g CO2 per km
        }

        totalCo2Emissions += co2Emissions;

        segments.push({
          from: allAirports[i].name,
          to: allAirports[i + 1].name,
          distance: segmentDistance,
          planeType,
          co2Emissions
        });
      }

      setSegmentDistances(segments);
      setTotalDistance(total);
      setTotalCo2(totalCo2Emissions); // Set the total CO2 emissions
    }
  };//het

  return (
    <div  > <br />  
      <h1>Airport Distance and Co2 Calculator</h1>

      {/* departure */}
      <div>
        <h2>Select First Airport</h2> <div className='firstSelect'>
        <select onChange={handleSelect1} defaultValue="">
          <option value="" disabled>
            Select an airport
          </option>
          {sortedAirports.map((airport) => (
            <option key={airport.id} value={JSON.stringify(airport)}>
              {airport.name}
            </option>
          ))}
        </select> </div>
      </div>
      {/* //Transit */}
      <div>
        <h2>Transit Airports</h2>
        {transitAirports.map((_, index) => (
          <div key={index}>
            <select onChange={(e) => handleTransitSelect(e, index)} defaultValue="">
              <option value="" disabled>
                Select a transit airport
              </option>
              {sortedAirports.map((airport) => (
                <option key={airport.id} value={JSON.stringify(airport)}>
                  {airport.name}
                </option>
              ))}
            </select>
          </div>
        ))} <br />
        <button onClick={handleAddTransitAirport}>Add Transit Airport</button>
      </div>
      {/* //destination */}
      <div>
        <h2>Select Second Airport</h2>
        <select onChange={handleSelect2} defaultValue="">
          <option value="" disabled>
            Select an airport
          </option>
          {sortedAirports.map((airport) => (
            <option key={airport.id} value={JSON.stringify(airport)}>
              {airport.name}
            </option>
          ))}
        </select>
      </div>
      <br />


      <button onClick={calculateDistances}>Calculate Distance and Co2 emitted</button>

      <div>
        <h3>Segment Distances</h3>
        <ul>
          {segmentDistances.map((segment, index) => (
            <li key={index}>
              {segment.from} → {segment.to}: {segment.distance.toFixed(2)} km
              <br />
              Plane Used: {segment.planeType}
              <br />
              CO2 Emissions: {segment.co2Emissions.toFixed(2)} kg
            </li>
          ))}
        </ul>
      </div>


      {totalDistance !== null && (
        <div>
          <h3>Total Distance</h3>
          <p>{totalDistance.toFixed(2)} km</p>
        </div>
      )}


      {totalCo2 !== null && (
        <div>
          <h3>Total CO2 Emissions</h3>
          <p>{totalCo2.toFixed(2)} kg</p>
        </div>
      )}

      
    </div>
  );
};

export default AirportDistanceCalculator;
