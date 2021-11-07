import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Button } from "@mui/material";

const center = {
  lat: -35.0,
  lng: -59.0,
};

interface Props {
  clickedPos: google.maps.LatLngLiteral;
  setClickedPos: React.Dispatch<
    React.SetStateAction<google.maps.LatLngLiteral>
  >;
}

const CustomMap: React.FC<Props> = ({ clickedPos, setClickedPos }) => {
  // Load the map
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_KEY!,
  });

  // Save map in ref to interact with the map
  const mapRef = React.useRef<google.maps.Map | null>(null);

  const onMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng !== null) {
      const latitude = e.latLng.lat();
      const longitude = e.latLng.lng();
      setClickedPos({ lat: latitude, lng: longitude });
    }
  };

  const moveTo = (position: google.maps.LatLngLiteral) => {
    if (mapRef.current) {
      mapRef.current.panTo({ lat: position.lat, lng: position.lng });
      mapRef.current.setZoom(14);
      setClickedPos(position);
    }
  };

  const handleGetMyLocation = (): void => {
    navigator.geolocation.getCurrentPosition((position) => {
      moveTo({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  };

  const onLoad = (map: google.maps.Map): void => {
    mapRef.current = map;
    // move to user's location
    handleGetMyLocation();
  };

  const onUnMount = (): void => {
    mapRef.current = null;
  };

  // TODO: show loader
  if (!isLoaded) return <p>Map is loading...</p>;

  return (
    <>
      <Button variant="outlined" onClick={handleGetMyLocation}>
        Obtener mi ubicacion
      </Button>
      <GoogleMap
        mapContainerStyle={{
          width: "100%",
          height: "100vh",
        }}
        center={center}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
        }}
        zoom={14}
        onLoad={onLoad}
        onUnmount={onUnMount}
        onClick={onMapClick}
      >
        {clickedPos.lat && clickedPos.lng ? (
          <Marker position={clickedPos} />
        ) : null}
      </GoogleMap>
    </>
  );
};

export default CustomMap;
