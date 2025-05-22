import { useContext, useLayoutEffect, useRef } from "react";
import { PlacesContext } from "../context";
import { Loading } from "./Loading";
import { Map } from "maplibre-gl";

export const MapView = () => {
  const { isLoading, userLocation } = useContext(PlacesContext);
  const mapDiv = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!isLoading) {
      const map = new Map({
        container: mapDiv.current!, // container id
        style: "https://demotiles.maplibre.org/style.json", // style URL
        center: userLocation, // starting position [lng, lat]
        zoom: 1, // starting zoom
      });
    }
  }, [isLoading]);
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div
      ref={mapDiv}
      style={{
        backgroundColor: "red",
        height: "100vh",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
      }}>
      {userLocation?.join(" , ")}
    </div>
  );
};
