export type ClickedPositionType = "sighting" | "initial";

export interface ClickedPosition {
  position: google.maps.LatLngLiteral;
  type: ClickedPositionType;
}
