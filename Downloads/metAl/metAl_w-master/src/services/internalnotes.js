import http from "./httpService";
import { apiUrl } from "../config/config.json";
const apiEndpoint = apiUrl + "/internalnotes";

function internalpostUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getInternalNotes() {
  return http.get(apiEndpoint);
}

export function getInternalNote(Id) {
  return http.get(internalpostUrl(Id));
}

export function getInternalNoteTopic(Id) {
  return http.get(`${apiEndpoint}/topic/${Id}`);
}

export function saveInternalNote(post) {
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

  console.log("internal notes", body);
  //  console.log(getInternalNote())
  //add a new categorie
  return http.post(apiEndpoint, body);
}

//delete categories
export function deleteInternalNote(Id) {
  console.log(internalpostUrl(Id));
  return http.delete(internalpostUrl(Id));
}
