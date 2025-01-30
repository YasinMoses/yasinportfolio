//import axios from 'axios';
import http from './httpService';
// import { apiUrl } from './../config/config.json';

const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl + '/supervisors';

function userUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getSupervisors() {
  return http.get(apiEndpoint);
}

export function getSupervisor(userId) {
  console.log({ userId });
  return http.get(userUrl(userId));
}

export function getSupervisorByUser(id) {
  console.log({ id });
  return http.get(`${apiEndpoint}/user/${id}`);
}

export function saveSupervisor(user, imageSrc) {
  console.log("line 24: ", user, imageSrc);

  const formData = new FormData();
  //update
  if (user._id) {
    //clone user and delete _id
    const body = { ...user };
    delete body._id;
    for (let key in body) {
      formData.append(key, body[key]);
    }
    formData.append('imageSrc', imageSrc);
    return http.put(userUrl(user._id), formData);
  }
  const body = { ...user };
  for (let key in body) {
    formData.append(key, body[key]);
  }
  formData.append('imageSrc', imageSrc);
  //add a new user
  return http.post(apiEndpoint, formData);
}

export function patchSupervisor(user, imageSrc) {
  const formData = new FormData();
  //update
  if (user._id) {
    const body = { ...user };
    delete body._id;
    delete body.imageSrc;
    for (let key in body) {
      formData.append(key, body[key]);
    }
    formData.append('imageSrc', imageSrc);
    return http.patch(userUrl(user._id), formData);
  }
}

//delete users
export function deleteSupervisor(userId) {
  console.log({ userId });
  return http.delete(userUrl(userId));
}  