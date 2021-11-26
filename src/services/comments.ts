import { IComment } from "../types/Publication";
import http from "../utils/http";

const add = (data: IComment) => {
  return http.post("/comment/add", data);
};

const CommentsService = {
  add,
};

export default CommentsService;
