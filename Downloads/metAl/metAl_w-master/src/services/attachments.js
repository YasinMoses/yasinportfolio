import http from "./httpService";
const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl + "/attachments";
export const saveAttachments = (files, type, id, onUploadProgress) => {
  const formData = new FormData();
  formData.append("type", type);
  for (let x = 0; x < files.length; x++) {
    formData.append("attachments", files[x]);
  }
  //http.put(apiEndpoint + "/" + id, formData, { onUploadProgress });
  http.put(apiEndpoint + "/" + id, formData, {
    onUploadProgress: (progressEvent) =>
      onUploadProgress(
        Math.round((progressEvent.loaded / progressEvent.total) * 100)
      ),
  });
};

export const deleteAttachments = async (filePath, id, type) => {
  await http.delete(apiEndpoint + "/" + id + "/" + type + "/" + filePath);
};