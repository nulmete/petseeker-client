import { IPublication } from "../types/Publication";
import http from "../utils/http";

const get = () => {
  return http.get("/publications/list");
};

const add = (data: IPublication) => {
  return http.post("/publication/add", data);
};

const remove = (id: number) => {
  return http.delete(`/publication/delete/${id}`);
};

const PublicationService = {
  get,
  add,
  remove,
};

export default PublicationService;
