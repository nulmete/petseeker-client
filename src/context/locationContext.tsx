import React, { Dispatch, SetStateAction } from "react";

type UserPosition = {
  lat: number;
  lng: number;
};

interface UserLocationValue {
  currentLocation: UserPosition | null;
  setCurrentLocation: Dispatch<SetStateAction<UserPosition | null>>;
}

const locationCtxDefaultValue: UserLocationValue = {
  currentLocation: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCurrentLocation: () => {},
};

const LocalStateContext = React.createContext(locationCtxDefaultValue);
const LocalStateProvider = LocalStateContext.Provider;

interface Props {
  children: React.ReactNode;
}

const LocationStateProvider: React.FC<Props> = ({ children }) => {
  const [currentLocation, setCurrentLocation] = React.useState(
    locationCtxDefaultValue.currentLocation
  );

  React.useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      setCurrentLocation(pos);
    });
  }, []);

  return (
    <LocalStateProvider value={{ currentLocation, setCurrentLocation }}>
      {children}
    </LocalStateProvider>
  );
};

const useLocationContext = () => {
  return React.useContext(LocalStateContext);
};

export { LocationStateProvider, useLocationContext };
