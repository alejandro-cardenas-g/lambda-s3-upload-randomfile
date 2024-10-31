import { service } from "./services/service.mjs";

export const handler = async (event) => {
  const data = service.getData();
  const uploadBlobResult = await service.createBlob(data);
  const response = {
    statusCode: 200,
    body: JSON.stringify(uploadBlobResult),
  };
  return response;
};
