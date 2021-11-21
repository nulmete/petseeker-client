import { IUser } from "../types/User";
import http from "../utils/http";

const getUserByUUID = async (uuid: string): Promise<IUser> => {
  console.log({ uuid });
  const response = await http.get<IUser>(`/user/${uuid}`);
  console.log({ response });
  return response.data;
};

const create = (data: IUser) => {
  return http.post("/user", data);
};

const UserService = {
  getUserByUUID,
  create,
};

export default UserService;
