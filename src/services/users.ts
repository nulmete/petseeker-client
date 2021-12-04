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
  return http.put("/user", data);
};

const UserService = {
  getUserByUUID,
  create,
  update,
};

export default UserService;
