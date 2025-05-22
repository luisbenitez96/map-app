import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { MapsApp } from "./MapsApp.tsx";

if (!navigator.geolocation) {
  alert("Tu navegador no tiene acceso a la geolocalizacion");
  throw new Error("Tu navegador no tiene acceso a la geolocalizacion");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MapsApp />
  </StrictMode>
);
