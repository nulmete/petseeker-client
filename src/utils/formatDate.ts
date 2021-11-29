import { format } from "date-fns";

export const formatDate = (date: string): string | undefined => {
  if (date == null) return undefined;
  const dateStringToDate = new Date(date);
  const formattedDate = format(dateStringToDate, "dd/MM/yyyy HH:mm");
  return formattedDate;
};
