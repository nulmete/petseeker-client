import { IUser } from "../types/User";
import http from "../utils/http";

const getUserByUUID = async (uuid: string): Promise<IUser> => {
  const response = await http.get<IUser>(`/user/${uuid}`);
  return response.data;
};

const create = (data: IUser) => {
  return http.post("/user", data);
};

const update = (data: IUser) => {
  let query = "";
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(data)) {
    query += `${key}=${value}&`;
  }
  // slice() to remove last & from query string
  return http.put(`/user?${query.slice(0, -1)}`);
};

const UserService = {
  getUserByUUID,
  create,
  update,
};

export default UserService;
