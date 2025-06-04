import { MapProvider, PlacesProvider } from "./context";
import { HomePage } from "./pages/HomePage";
import "./styles.css";

import "maplibre-gl/dist/maplibre-gl.css";
export const MapsApp = () => {
  return (
    <PlacesProvider>
      <MapProvider>
        <HomePage />
      </MapProvider>
    </PlacesProvider>
  );
};
