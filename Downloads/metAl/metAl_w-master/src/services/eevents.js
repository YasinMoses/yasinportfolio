import { apiUrl } from "./../config/config.json";
import http from "./httpService";
const apiEndpoint = apiUrl + "/eevents";

function eeventUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getEevents() {
  return http.get(apiEndpoint);
}

export function getEevent(Id) {
  return http.get(eeventUrl(Id));
}

// export function saveEevent(eevent, attachments, onUploadProgress) {
//     const formData = new FormData();
//     //clone
//     const body = { ...eevent };
//     const config = {
//         onUploadProgress: (progressEvent) =>
//             //onUploadProgress(Math.trunc(progressEvent.loaded / progressEvent.total)),
//             onUploadProgress(progressEvent.loaded / progressEvent.total),
//     };

//     //update
//     if (eevent._id) {
//         //delete _id
//         delete body._id;
//         delete body.attachments;
//         for (let key in body) {
//             formData.append(key, body[key]);
//         }

//         // for uploading files
//         if (attachments != null || (undefined && attachments.length > 0)) {
//             for (let x = 0; x <= attachments.length; x++) {
//                 formData.append("attachments", attachments[x]);
//             }
//         }

//         return http.put(eeventUrl(eevent._id), formData, config);
//     }
//     for (let key in body) {
//         formData.append(key, body[key]);
//     }
//     if (attachments.length > 0) {
//         for (let x = 0; x <= attachments.length; x++) {
//             formData.append("attachments", attachments[x]);
//         }
//     } else {
//         formData.append("attachments", attachments);
//     }

//     //add a new eevent
//     return http.post(apiEndpoint, formData, config);
// }

export function saveEevent(eevent, attachments) {
  const formData = new FormData();

  //update
  if (eevent._id) {
    const body = { ...eevent };
    delete body._id;
    for (let key in body) {
      formData.append(key, body[key]);
    }

    if (attachments) {
      for (let x = 0; x < attachments.length; x++) {
        formData.append("attachments", attachments[x]);
      }
    }

    return http.put(eeventUrl(eevent._id), body);
  }

  const body = { ...eevent };

  for (let key in body) {
    formData.append(key, body[key]);
  }

  if (attachments) {
    formData.append("imageSrc", attachments[0]);
  } else {
    formData.append("imageSrc", attachments);
  }

  // create new
  return http.post(apiEndpoint, body);
}

//delete eevents
export function deleteService(Id) {
  return http.delete(eeventUrl(Id));
}
