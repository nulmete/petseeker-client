import { PUBLICATION_TYPES } from "../constants";

export const getPublicationType = (pubType: number) => {
  const found = Object.values(PUBLICATION_TYPES).find(
    (p) => +p.value === pubType
  );
  if (!found) return "";
  return found.label;
};
