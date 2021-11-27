import http from "../utils/http";

type CloudinaryUploadResponse = {
  // eslint-disable-next-line camelcase
  secure_url: string;
};

const isCloudinaryUploadResponse = (
  response: any
): response is CloudinaryUploadResponse => {
  return "secure_url" in response;
};

const upload = async (data: any): Promise<CloudinaryUploadResponse | null> => {
  const response = await http.post(
    "https://api.cloudinary.com/v1_1/dq6tb1lgp/image/upload",
    data
  );
  if (response && isCloudinaryUploadResponse(response.data)) {
    return response.data;
  }
  return null;
};

const FilesService = {
  upload,
};

export default FilesService;
