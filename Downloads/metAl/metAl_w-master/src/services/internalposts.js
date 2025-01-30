import http from "./httpService";
import { apiUrl } from "../config/config.json";
const apiEndpoint = apiUrl + "/internalposts";

function internalpostUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getInternalPosts() {
  return http.get(apiEndpoint);
}

export function getInternalPost(Id) {
  return http.get(internalpostUrl(Id));
}

export function getInternalPostTopic(Id) {
  return http.get(`${apiEndpoint}/topic/${Id}`);
}

export function saveInternalPost(post) {
  //clone

  //update
  if (post._id) {
    const body = { ...post };
    delete body._id;

    //formData.append('attachments', attachments);

    console.log(body);

    return http.put(internalpostUrl(post._id), body);
  }
  const body = { ...post };

  console.log(body);

  //add a new categorie
  return http.post(apiEndpoint, body);
}

//delete categories
export function deleteInternalPost(Id) {
  return http.delete(internalpostUrl(Id));
}
