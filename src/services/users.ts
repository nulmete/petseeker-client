import { IUser } from "../types/User";
import http from "../utils/http";

const create = (data: IUser) => {
  return http.post("/user", data);
};

const UserService = {
  create,
};

export default UserService;
