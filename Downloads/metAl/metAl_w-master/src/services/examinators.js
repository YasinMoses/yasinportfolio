//import axios from 'axios';
import http from './httpService'; 
const apiUrl = process.env.REACT_APP_API_URL;

const apiEndpoint = apiUrl+'/examinators';

  function userUrl(id) {
    return `${apiEndpoint}/${id}`;
  }
  
  export function getExaminators() {
    return http.get(apiEndpoint);
  }
  
  export function getExaminator(userId) {
    return http.get(userUrl(userId));
  }

  export function getExaminatorByUser(id) {
    return http.get(`${apiEndpoint}/user/${id}`);
  }
  
  export function saveExaminator(user,imageSrc) {
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

  export function patchExaminator(user,imageSrc) {
  const formData = new FormData(); 
  //update
  if (user._id) {
    const body = { ...user };
    delete body._id;
    delete body.imageSrc;
    for ( let key in body ) {
      formData.append(key, body[key]);
      }
      formData.append('imageSrc', imageSrc);
    return http.patch(userUrl(user._id), formData);
  }
  }
  
  //delete users
  export function deleteExaminator(userId) {
    return http.delete(userUrl(userId));
  }  