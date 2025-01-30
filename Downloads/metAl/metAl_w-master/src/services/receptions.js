//import axios from 'axios';
import http from './httpService'; 
// import {apiUrl} from './../config/config.json';
const apiUrl = process.env.REACT_APP_API_URL;

const apiEndpoint = apiUrl+'/receptions';

  function userUrl(id) {
    return `${apiEndpoint}/${id}`;
  }
  
  export function getReceptions() {
    return http.get(apiEndpoint);
  }
  
  export function getReception(userId) {
    return http.get(userUrl(userId));
  }
  
  export function saveReception(user,imageSrc) {
    const formData = new FormData(); 
   //update
   if (user._id) {
     //clone user and delete _id
     const body = { ...user };
     delete body._id;
     for ( let key in body ) {
        formData.append(key, body[key]);
        }
       formData.append('imageSrc', imageSrc);
     return http.put(userUrl(user._id), formData);
   }
   const body = { ...user };
      for ( let key in body ) {
        formData.append(key, body[key]);
        }
       formData.append('imageSrc', imageSrc);
   //add a new user
   return http.post(apiEndpoint, formData);
 }
   //patch users
   export function patchReception(data,imageSrc) {
    const formData = new FormData(); 
   //update
   if (data._id) {
     const body = { ...data };
     delete body._id;
     delete body.imageSrc;
     for ( let key in body ) {
       if(key === 'workingHours')
        {
          formData.append(key, JSON.stringify(body[key]))
        }
       else formData.append(key, body[key]);
        }
       formData.append('imageSrc', imageSrc);
     return http.patch(userUrl(data._id), formData);
   }
  }
  
  //delete users
  export function deleteReception(userId) {
    return http.delete(userUrl(userId));
  }  