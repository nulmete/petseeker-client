import { ISighting } from "../types/Publication";
import http from "../utils/http";

const add = (data: ISighting) => {
  return http.post("/sighting/add", data);
};

const SightingsService = {
  add,
};

export default SightingsService;
