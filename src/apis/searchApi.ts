import axios from "axios";

const searchApi = axios.create({
  baseURL: "https://nominatim.openstreetmap.org",
  params: {
    key: "AIzaSyB7KxfnKdO_jiGKFZALH_LAm0nwZUUuoMk",
    format: "geojson",
    polygon_geojson: 1,
    addressdetails: 1,
  },
});

export default searchApi;
