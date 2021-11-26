import { IPublication } from "../types/Publication";
import http from "../utils/http";

const getById = async (id: string): Promise<IPublication> => {
  const response = await http.get<IPublication>(`publication/${id}`);
  return response.data;
};

const get = async (): Promise<IPublication[]> => {
  const response = await http.get<IPublication[]>("/publications/list");
  return response.data;
};

const add = (data: IPublication) => {
  return http.post("/publication/add", data);
};

const remove = (id: number) => {
  return http.delete(`/publication/delete/${id}`);
};

const PublicationService = {
  getById,
  get,
  add,
  remove,
};

export default PublicationService;
