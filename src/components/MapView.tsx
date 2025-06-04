import { useContext, useLayoutEffect, useRef } from "react";
import { PlacesContext, MapContext } from "../context";
import { Loading } from "./Loading";
import maplibregl from "maplibre-gl";
import MaplibreGeocoder from "@maplibre/maplibre-gl-geocoder";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import { geocoderApi } from "../context/places/PlacesProvider";

export const MapView = () => {
  const { isLoading, userLocation } = useContext(PlacesContext);
  const { setMap } = useContext(MapContext);
  const mapDiv = useRef<HTMLDivElement>(null);
  const geocoderAdded = useRef(false); // Ref para asegurar que el geocodificador se añade solo una vez

  useLayoutEffect(() => {
    if (!isLoading && mapDiv.current) {
      const mapInstance = new maplibregl.Map({
        container: mapDiv.current!,
        // Use a minimalist raster style
        style: {
          version: 8,
          name: "Blank",
          center: [0, 0],
          zoom: 0,
          sources: {
            "raster-tiles": {
              type: "raster",
              tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
              tileSize: 256,
              minzoom: 0,
              maxzoom: 19,
            },
          },
          layers: [
            {
              id: "background",
              type: "background",
              paint: {
                "background-color": "#e0dfdf",
              },
            },
            {
              id: "simple-tiles",
              type: "raster",
              source: "raster-tiles",
            },
          ],
        },
        center: userLocation || [-87.61694, 41.86625],
        zoom: 15.99,
        pitch: 40,
        bearing: 20,
        canvasContextAttributes: { antialias: true },
      });

      // Añadir el geocodificador si aún no se ha añadido
      if (!geocoderAdded.current) {
        mapInstance.addControl(
          new MaplibreGeocoder(geocoderApi, {
            maplibregl: maplibregl, // Pasar la instancia de maplibregl
          }),
          "top-left" // Posición del control
        );
        geocoderAdded.current = true;
      }

      setMap(mapInstance);
    }
  }, [isLoading, userLocation]);
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div
      ref={mapDiv}
      id="map"
      style={{
        backgroundColor: "red",
        height: "100vh",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
      }}>
      {/* userLocation?.join(" , ") Podrías querer quitar esto si interfiere con el mapa */}
    </div>
  );
};
