import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Button } from "@mui/material";

interface Props {
  getLocationCallback: (location: string) => void;
  isEdit: boolean;
}

const CustomMap: React.FC<Props> = ({
  getLocationCallback,
  isEdit = false,
}) => {
  // Load the map
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_KEY!,
  });

  // Handle clicked position in map
  const [clickedPos, setClickedPos] = React.useState<
    google.maps.LatLngLiteral[]
  >([] as google.maps.LatLngLiteral[]);

  // Save map in ref to interact with the map
  const mapRef = React.useRef<google.maps.Map | null>(null);

  const onMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng !== null) {
      const latitude = e.latLng.lat();
      const longitude = e.latLng.lng();
      if (!isEdit) {
        setClickedPos([{ lat: latitude, lng: longitude }]);
      } else {
        // There should be only 1 marker before (when publication was created)
        // Only let the user select a second marker, not many.
        // 2 = #sightings + 1
        if (clickedPos.length >= 2) {
          const clickedPosCopy = [...clickedPos];
          clickedPosCopy.splice(1, 1);
          setClickedPos(clickedPosCopy);
        }
        setClickedPos((current) => [
          ...current,
          { lat: latitude, lng: longitude },
        ]);
      }
    }
  };

  const moveTo = (position: google.maps.LatLngLiteral) => {
    if (mapRef.current) {
      mapRef.current.panTo({ lat: position.lat, lng: position.lng });
      mapRef.current.setZoom(14);
      setClickedPos([position]);
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
    // TODO: what for edit case? - maybe return the last elem of the array
    const stringifiedLocation = `${clickedPos[0].lat},${clickedPos[0].lng}`;
    getLocationCallback(stringifiedLocation);
  };

  // TODO: show loader
  if (!isLoaded) return <p>Map is loading...</p>;

  return (
    <>
      {!isEdit && (
        <Button variant="outlined" onClick={handleGetMyLocation}>
          Obtener mi ubicacion
        </Button>
      )}
      <GoogleMap
        mapContainerStyle={{
          width: "100%",
          height: "100vh",
        }}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
        }}
        zoom={14}
        onLoad={onLoad}
        onUnmount={onUnMount}
        onClick={onMapClick}
      >
        {/* {clickedPos.lat && clickedPos.lng ? (
          <Marker position={clickedPos} />
        ) : null} */}
        {clickedPos.map((pos, index) => (
          <Marker
            icon={
              isEdit && index !== 0
                ? {
                    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                    strokeColor: "green",
                    scale: 5,
                  }
                : undefined
            }
            position={pos}
          />
        ))}
      </GoogleMap>
    </>
  );
};

export default CustomMap;
