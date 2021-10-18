import IPublication from "../types/Publication";
import http from "../utils/http";

// POST
const create = (data: IPublication) => {
  return http.post("/publications", data);
};

const PublicationService = {
  create,
};

export default PublicationService;
