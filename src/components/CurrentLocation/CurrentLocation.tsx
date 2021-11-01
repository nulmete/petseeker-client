import React, { useState } from "react";

interface Props {
  moveTo: (position: google.maps.LatLngLiteral) => void;
}

const CurrentLocation: React.FC<Props> = ({ moveTo }) => {
  const [disabled, setDisabled] = useState<boolean>(false);

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        // deactivate button when geolocation is working
        setDisabled(true);
        navigator.geolocation.getCurrentPosition((position) => {
          // activate button when geolocation has finished
          setDisabled(false);
          // call the callback function
          moveTo({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        });
      }}
    >
      {disabled ? <p>searching...</p> : <p>get position</p>}
    </button>
  );
};

export default CurrentLocation;
