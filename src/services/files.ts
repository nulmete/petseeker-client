import http from "../utils/http";

const upload = (data: any) => {
  return http.post("/files", data);
};

const FilesService = {
  upload,
};

export default FilesService;
