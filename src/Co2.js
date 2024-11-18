import React, { useState } from "react";
import airports from "airports-json";
import { getDistance } from "geolib";
import Select, { components } from "react-select";
import { FixedSizeList as List } from "react-window";

const MenuList = (props) => {
  const { options, children, maxHeight, getValue } = props;
  const [value] = getValue();
  const initialOffset = options.indexOf(value) * 35;

  return (
    <components.MenuList {...props}>
      <List
        height={maxHeight}
        itemCount={children.length}
        itemSize={35} // Height of each option
        initialScrollOffset={initialOffset}
        width="100%"
      >
        {({ index, style }) => (
          <div style={style}>{children[index]}</div>
        )}
      </List>
    </components.MenuList>
  );
};

const AirportDistanceCalculator = () => {
  const [selectedAirport1, setSelectedAirport1] = useState(null);
  const [selectedAirport2, setSelectedAirport2] = useState(null);
  const [transitAirports, setTransitAirports] = useState([]);
  const [segmentDistances, setSegmentDistances] = useState([]);
  const [totalDistance, setTotalDistance] = useState(null);
  const [totalCo2, setTotalCo2] = useState(null);

  // Preprocess airport data
  const formattedOptions = React.useMemo(() => {
    const validAirports = Object.values(airports.airports)
      .filter((airport) => airport && airport.name)
      .sort((a, b) => a.name.localeCompare(b.name));
    return validAirports.map((airport) => ({
      value: JSON.stringify(airport),
      label: airport.name,
    }));
  }, []);

  const handleAddTransitAirport = () => {
    setTransitAirports([...transitAirports, null]);
  };

  const handleTransitSelect = (selectedOption, index) => {
    const airport = selectedOption ? JSON.parse(selectedOption.value) : null;
    const updatedTransitAirports = [...transitAirports];
    updatedTransitAirports[index] = airport;
    setTransitAirports(updatedTransitAirports);
  };

  const calculateDistances = () => {
    if (selectedAirport1 && selectedAirport2) {
      const allAirports = [
        selectedAirport1,
        ...transitAirports.filter(Boolean),
        selectedAirport2,
      ];

      let total = 0;
      let totalCo2Emissions = 0;
      const segments = [];

      for (let i = 0; i < allAirports.length - 1; i++) {
        const segmentDistance =
          getDistance(
            {
              latitude: parseFloat(allAirports[i].latitude_deg),
              longitude: parseFloat(allAirports[i].longitude_deg),
            },
            {
              latitude: parseFloat(allAirports[i + 1].latitude_deg),
              longitude: parseFloat(allAirports[i + 1].longitude_deg),
            }
          ) / 1000; // Convert to kilometers

        total += segmentDistance;

        // Calculate CO2 emissions for this segment
        let co2Emissions = 0;
        let planeType = "";
        if (segmentDistance < 500) {
          planeType = "Regional Jet";
          co2Emissions = segmentDistance * 0.15; // 150g CO2 per km
        } else {
          planeType = "Widebody/Narrowbody Jet";
          co2Emissions = segmentDistance * 0.1; // 100g CO2 per km
        }

        totalCo2Emissions += co2Emissions;

        segments.push({
          from: allAirports[i].name,
          to: allAirports[i + 1].name,
          distance: segmentDistance,
          planeType,
          co2Emissions,
        });
      }

      setSegmentDistances(segments);
      setTotalDistance(total);
      setTotalCo2(totalCo2Emissions);
    }
  };

  return (
    <div>
      <h1>Airport Distance and CO2 Calculator</h1>

      {/* Departure Airport */}
      <div>
        <h2>Select First Airport</h2>
        <Select
          options={formattedOptions}
          components={{ MenuList }} // Attach the virtualized MenuList
          onChange={(selectedOption) =>
            setSelectedAirport1(JSON.parse(selectedOption.value))
          }
          placeholder="Select an airport"
        />
      </div>

      {/* Transit Airports */}
      <div>
        <h2>Transit Airports</h2>
        {transitAirports.map((_, index) => (
          <div key={index}>
            <Select
              options={formattedOptions}
              components={{ MenuList }} // Attach the virtualized MenuList
              onChange={(selectedOption) =>
                handleTransitSelect(selectedOption, index)
              }
              placeholder="Select a transit airport"
            />
          </div>
        ))}
        <button onClick={handleAddTransitAirport}>Add Transit Airport</button>
      </div>

      {/* Destination Airport */}
      <div>
        <h2>Select Second Airport</h2>
        <Select
          options={formattedOptions}
          components={{ MenuList }} // Attach the virtualized MenuList
          onChange={(selectedOption) =>
            setSelectedAirport2(JSON.parse(selectedOption.value))
          }
          placeholder="Select an airport"
        />
      </div>

      <button onClick={calculateDistances}>
        Calculate Distance and CO2 Emissions
      </button>

      {/* Segment Distances */}
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

      {/* Total Distance */}
      {totalDistance !== null && (
        <div>
          <h3>Total Distance</h3>
          <p>{totalDistance.toFixed(2)} km</p>
        </div>
      )}

      {/* Total CO2 Emissions */}
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
