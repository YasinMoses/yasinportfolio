//import axios from 'axios';
import http from './httpService';
import { apiUrl } from './../config/config.json';

const apiEndpoint = apiUrl + '/paramedics';

function userUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getParamedics() {
  return http.get(apiEndpoint);
}

export function getParamedic(userId) {
  console.log({ userId });
  return http.get(userUrl(userId));
}

export function getParamedicByUser(id) {
  console.log({ id });
  return http.get(`${apiEndpoint}/user/${id}`);
}

export function saveParamedic(user, imageSrc) {
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

export function patchParamedic(user, imageSrc) {
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
    return http.put(userUrl(user._id), formData);
  }
}

//delete users
export function deleteParamedic(userId) {
  console.log({ userId });
  return http.delete(userUrl(userId));
}  