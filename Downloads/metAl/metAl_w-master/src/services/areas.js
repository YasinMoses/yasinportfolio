import { apiUrl } from "./../config/config.json";
import http from "./httpService";
const apiEndpoint = apiUrl + "/areas";

function areaUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getAreas() {
  return http.get(apiEndpoint);
}

export function getArea(Id) {
  return http.get(areaUrl(Id));
}

export function saveArea(area) {
  const formData = new FormData();
  //clone
  const body = { ...area };

  //update

  if (area._id) {
    const body = { ...area };
    delete body._id;

    for (let key in body) {
      formData.append(key, body[key]);
    }

    return http.put(areaUrl(area._id), body);
  }

  for (let key in body) {
    formData.append(key, body[key]);
  }

  console.log('body area',body);
  //add a new area

  return http.post(apiEndpoint, body);
}

//delete areas
export function deleteArea(Id) {
  return http.delete(areaUrl(Id));
}
