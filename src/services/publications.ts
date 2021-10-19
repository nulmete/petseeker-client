import IPublication from "../types/Publication";
import http from "../utils/http";

// GET
const get = () => {
  return http.get("/publications/list");
};

// POST
const create = (data: IPublication) => {
  return http.post("/publications", data);
};

const PublicationService = {
  get,
  create,
};

export default PublicationService;
