import { useEffect, useReducer, type JSX } from "react";
import { PlacesContext } from "./PlacesContext";
import { placesReducer } from "./PlacesReducer";
import { getUserLocation } from "../../helpers";

// Interfaz para el objeto config del geocodificador
interface GeocoderConfig {
  query?: string | number[] | undefined;
  // Añade otras propiedades si son necesarias según la API del geocodificador
}
export interface PlacesState {
  isLoading: boolean;
  userLocation?: [number, number];
}

const INITIAL_STATE: PlacesState = {
  isLoading: true,
  userLocation: undefined,
};
interface Props {
  children: JSX.Element | JSX.Element[];
  geocoderApi: GeocoderConfig;
}
export const geocoderApi = {
  forwardGeocode: async (config: GeocoderConfig) => {
    const features = [];
    try {
      const request = `https://nominatim.openstreetmap.org/search?q=${config.query}&format=geojson&polygon_geojson=1&addressdetails=1`;
      const response = await fetch(request);
      const geojson = await response.json();
      for (const feature of geojson.features) {
        const center = [
          feature.bbox[0] + (feature.bbox[2] - feature.bbox[0]) / 2,
          feature.bbox[1] + (feature.bbox[3] - feature.bbox[1]) / 2,
        ];
        const point = {
          id: String(
            feature.properties.osm_id ||
              feature.id ||
              feature.properties.place_id ||
              Math.random().toString(36).substring(2)
          ),
          type: "Feature" as const,
          geometry: {
            type: "Point" as const,
            coordinates: center,
          },
          place_name: feature.properties.display_name,
          properties: feature.properties,
          text: feature.properties.display_name,
          place_type: ["place"],
          center,
        };
        features.push(point);
      }
    } catch (e) {
      console.error(`Failed to forwardGeocode with error: ${e}`);
    }

    return {
      type: "FeatureCollection" as const,
      features,
    };
  },
};
export const PlacesProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(placesReducer, INITIAL_STATE);

  useEffect(() => {
    getUserLocation().then((lngLat) => {
      dispatch({ type: "setUserLocation", payload: lngLat });

      // en este useEffect se obtiene la geolocalizacion del usuario y se guarda en el estado del contexto, la funcion getUserLocation es una funcion asincrona que devuelve una promesa, se utiliza el then para obtener el resultado de la promesa y se pasa el resultado a la funcion dispatch, que es una funcion que se utiliza para actualizar el estado del contexto, se le pasa un action que es un objeto que tiene un type y un payload, el type es el tipo de accion que se quiere realizar y el payload es el dato que se quiere actualizar, el reducer es una funcion que recibe el estado actual y el action y devuelve el nuevo estado, el reducer es una funcion pura que no tiene efectos secundarios.
    });
  }, []);

  return (
    <PlacesContext.Provider
      value={{
        ...state,
        searchPlacesByTerm: (query: string) =>
          geocoderApi.forwardGeocode({ query }),
      }}>
      {children}

      {/* el children sirve para enviar el estado y el dispatch para que se pueda utilizar en el componente que se esta renderizando, en este caso es el componente que se esta renderizando el mapa, que lo recibe como props, se envia desde el padre que se llama MapsApp, que lo recibe como props, que en este caso es el h1 que esta en el componente MapsApp */}

      {/* el dispatch es una funcion que se utiliza para actualizar el estado del contexto, se le pasa un action que es un objeto que tiene un type y un payload, el type es el tipo de accion que se quiere realizar y el payload es el dato que se quiere actualizar, el reducer es una funcion que recibe el estado actual y el action y devuelve el nuevo estado, el reducer es una funcion pura que no tiene efectos secundarios */}
    </PlacesContext.Provider>
  );
};

// el placesContext.Provider es un componente que se utiliza para proporcionar el estado y el dispatch al componente que se esta renderizando, ya que si no enviamos el .Provider, el componente que se esta renderizando no va a tener acceso al estado y el dispatch, por lo que no va a poder utilizar el contexto, el .Provider viene de react, es un componente que utiliza el contexto, el contexto es un objeto que se utiliza para compartir datos entre componentes, el contexto se crea con el createContext, el contexto se crea con el nombre PlacesContext, el contexto se crea con el estado y el dispatch, el contexto se crea con el reducer, el reducer es una funcion que recibe el estado actual y el action y devuelve el nuevo estado,
