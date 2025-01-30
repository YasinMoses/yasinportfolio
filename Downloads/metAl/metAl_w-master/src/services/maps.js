import { apiUrl } from "../config/config.json";
import http from "./httpService";
const apiEndpoint = apiUrl + "/maps";

function mapUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getMaps() {
  return http.get(apiEndpoint);
}

export function getMap(Id) {
  return http.get(mapUrl(Id));
}

export function saveMap(map, attachments) {
  const formData = new FormData();
  const body = { ...map };


  //update
  if (map._id) {
    //clone map and delete _id
    const body = { ...map };
    delete body._id;
    for (let key in body) {
      formData.append(key, body[key]);
    }
    //formData.append('attachments', attachments);
    if (attachments) {
      for (let x = 0; x < attachments.length; x++) {
        formData.append("attachments", attachments[x]);
      }
    }


    return http.put(mapUrl(map._id), body);
  }

  // for (let key in body) {
  //   formData.append(key, body[key]);
  // }

  // if (attachments.length > 0) {
  //   for (let x = 0; x <= attachments.length; x++) {
  //     formData.append("attachments", attachments[x]);
  //   }
  // } else {
  //   formData.append("attachments", attachments);
  // }

  return http.post(apiEndpoint, body);
}

export function saveMapAreas(map) {
  const formData = new FormData();

  const body = { ...map };

  //update
  if (map._id) {
    //clone map and delete _id
    delete body._id;
    for (let key in body) {
      formData.append(key, body[key]);
    }
    return http.patch(mapUrl(map._id), body);
  }
}
//delete maps
export function deleteMap(Id) {
  return http.delete(mapUrl(Id));
}
