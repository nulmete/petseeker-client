export const serializeLocation = (
  location: google.maps.LatLngLiteral
): string => {
  return `${location.lat},${location.lng}`;
};

export const deserializeLocation = (
  location: string
): google.maps.LatLngLiteral => {
  const splittedLocation = location.split(",");
  return {
    lat: +splittedLocation[0],
    lng: +splittedLocation[1],
  };
};
