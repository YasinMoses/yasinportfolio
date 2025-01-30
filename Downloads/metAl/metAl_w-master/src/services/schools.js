//import axios from 'axios';
import http from './httpService'; 
const apiUrl = process.env.REACT_APP_API_URL;

const apiEndpoint = apiUrl+'/schools';

  function userUrl(id) {
    return `${apiEndpoint}/${id}`;
  }
  
  export function getSchools() {
    return http.get(apiEndpoint);
  }
  
  export function getSchoolByUser(id) {
    return http.get(`${apiEndpoint}/user/${id}`);
  }

  export function getSchool(userId) {
    return http.get(userUrl(userId));
  }
  
  export function saveSchool(user, imageSrc) {
    console.log("24 Number Line ", user, imageSrc);
    const formData = new FormData(); 
    const body = { ...user };
   //update
   if (user._id) {
     //clone user and delete _id
     delete body._id;
     delete body.imageSrc;
     for (let key in body) {
      if (key === 'workingHours') {
        formData.append(key, JSON.stringify(body[key]));
      } else {
        formData.append(key, body[key]);
      }
    }
       formData.append("imageSrc", imageSrc);
     return http.put(userUrl(user._id), formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
   }
   
   delete body.imageSrc;
  
  
   for (let key in body) {
     if (key === 'workingHours') {
       formData.append(key, JSON.stringify(body[key]));
     } else {
       formData.append(key, body[key]);
     }
   }
   formData.append("imageSrc", imageSrc);

   for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }
  
   return http.post(apiEndpoint, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
 }

  
 //patch users
 export function patchSchool(user,imageSrc) {
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
  export function deleteSchool(userId) {
    return http.delete(userUrl(userId));
  }  