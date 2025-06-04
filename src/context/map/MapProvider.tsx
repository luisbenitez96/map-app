import { useReducer, type JSX } from "react";
import { mapReducer } from "./MapReducer";

import { Marker, Popup, type Map } from "maplibre-gl";
import { MapContext } from "./MapContext";

export interface MapState {
  isMapReady: boolean;
  map?: Map;
}
interface Props {
  children: JSX.Element | JSX.Element[];
}
const INITIAL_STATE: MapState = {
  isMapReady: false,
  map: undefined,
};
export const MapProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(mapReducer, INITIAL_STATE);

  const setMap = (map: Map) => {
    const myLocationPopup = new Popup().setHTML(`
    <h4>Aqui estoy</h4>
    <p>En este es el lugar donde estoy ubicado</p>
    `);

    new Marker({ color: "#61DAFB" })
      .setLngLat(map.getCenter())
      .setPopup(myLocationPopup)
      .addTo(map);

    // el new marker sirve para que el mapa se centre en la posicion del usuario, setlnlat sirve para que el mapa se centre en la posicion del usuario, le paso el mapa y la posicion del usuario y el mapa se centra en la posicion del usuario, y pasmos el metodo addTo(map) para que se agregue la posicion del usuario al mapa

    dispatch({ type: "setMap", payload: map });
  };

  return (
    <MapContext.Provider value={{ ...state, setMap }}>
      {children}
    </MapContext.Provider>
  );
};
