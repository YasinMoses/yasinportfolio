//import axios from 'axios';
import http from './httpService'; 
// import {apiUrl} from './../config/config.json';

const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl+'/companies';

  function userUrl(id) {
    return `${apiEndpoint}/${id}`;
  }
  
  export function getCompanys() {
    return http.get(apiEndpoint);
  }
  
  export function getCompanyByUser(id) {
    return http.get(`${apiEndpoint}/user/${id}`);
  }

  export function getCompany(userId) {
    return http.get(userUrl(userId));
  }
  
  export function saveCompany(user, imageSrc) {
    console.log("24 Number Line ", user, imageSrc);
    const formData = new FormData(); 
    const body = { ...user };
   //update
   if (user._id) {
     //clone user and delete _id
     delete body._id;
     delete body.imageSrc;
     for ( let key in body ) {
        formData.append(key, body[key]);
        }
       formData.append('imageSrc', imageSrc);
     return http.put(userUrl(user._id), formData);
   }
   
      for ( let key in body ) {
        formData.append(key, body[key]);
        }
       formData.append('imageSrc', imageSrc);
   //add a new user
   return http.post(apiEndpoint, formData);
 }

  
 //patch users
 export function patchCompany(user,imageSrc) {
  const formData = new FormData(); 
 //update
 if (user._id) {
   const body = { ...user };
   delete body._id;
   delete body.imageSrc;
   for ( let key in body ) {
     if(key === 'workingHours')
      {
        formData.append(key, JSON.stringify(body[key]))
      }
     else 
      formData.append(key, body[key]);
      }
     formData.append('imageSrc', imageSrc);
   return http.patch(userUrl(user._id), formData);
 }
}
  
  //delete users
  export function deleteCompany(userId) {
    return http.delete(userUrl(userId));
  }  