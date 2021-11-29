import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import {
  ClickedPosition,
  ClickedPositionType,
} from "../../types/ClickedPosition";

interface Props {
  isEdit?: boolean;
  initialClickedPositions: ClickedPosition[];
  onMapClick: (e: google.maps.MapMouseEvent) => void;
}

const CustomMap: React.FC<Props> = ({
  isEdit = false,
  initialClickedPositions,
  onMapClick,
}) => {
  // Load the map
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_KEY!,
  });

  // Save map in ref to interact with the map
  const mapRef = React.useRef<google.maps.Map | null>(null);

  const moveTo = (
    position: google.maps.LatLngLiteral,
    type: ClickedPositionType
  ) => {
    if (mapRef.current) {
      mapRef.current.panTo({ lat: position.lat, lng: position.lng });
      mapRef.current.setZoom(14);
    }
  };

  const handleGetMyLocation = (): void => {
    navigator.geolocation.getCurrentPosition((position) => {
      const pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      moveTo(pos, "initial");
    });
  };

  const onLoad = (map: google.maps.Map): void => {
    mapRef.current = map;
    handleGetMyLocation();
  };

  const onLoadEdit = (map: google.maps.Map): void => {
    mapRef.current = map;
    return navigator.geolocation.getCurrentPosition(() => {
      initialClickedPositions?.forEach((pos) => {
        const { position, type } = pos;
        moveTo(position, type);
      });
    });
  };

  const onUnMount = (): void => {
    mapRef.current = null;
  };

  // TODO: show loader
  if (!isLoaded) return <p>Map is loading...</p>;

  return (
    <>
      <GoogleMap
        mapContainerStyle={{
          width: "100%",
          height: "60vh",
        }}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
        }}
        zoom={14}
        onLoad={!isEdit ? onLoad : onLoadEdit}
        onUnmount={onUnMount}
        onClick={onMapClick}
      >
        {initialClickedPositions.map((pos) => (
          <Marker
            icon={
              pos.type === "sighting"
                ? {
                    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                    strokeColor: "green",
                    scale: 5,
                  }
                : undefined
            }
            position={pos.position}
            // TODO: con esto podria pedir un marker en el back
            // y mostrar las "notas adicionales"
            onClick={(e) => {
              const lat = e.latLng?.lat();
              const lng = e.latLng?.lng();
              alert(`lat: ${lat} - lng: ${lng}`);
            }}
          />
        ))}
      </GoogleMap>
    </>
  );
};

CustomMap.defaultProps = {
  isEdit: false,
};

export default CustomMap;
