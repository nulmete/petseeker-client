import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import {
  ClickedPosition,
  ClickedPositionType,
} from "../../types/ClickedPosition";
import Loading from "../Loading";

interface Props {
  isEdit?: boolean;
  initialClickedPositions: ClickedPosition[];
  onMapClick: (e: google.maps.MapMouseEvent) => void;
  onMarkerClick?: (e: google.maps.MapMouseEvent) => void;
}

const CustomMap: React.FC<Props> = ({
  isEdit = false,
  initialClickedPositions,
  onMapClick,
  onMarkerClick = () => null,
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
  if (!isLoaded) return <Loading />;

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
        zoom={12}
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
            onClick={onMarkerClick}
          />
        ))}
      </GoogleMap>
    </>
  );
};

CustomMap.defaultProps = {
  isEdit: false,
  onMarkerClick: () => null,
};

export default CustomMap;
