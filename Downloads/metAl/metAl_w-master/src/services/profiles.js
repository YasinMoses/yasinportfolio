import http from './httpService'; 
import {apiUrl} from './../config/config.json';
const apiEndpoint = apiUrl+'/profiles';


  function profileUrl(id) {
    return `${apiEndpoint}/${id}`;
  }
  
  export function getProfiles() {
    return http.get(apiEndpoint);
  }
  
  export function getProfile(Id) {
    return http.get(profileUrl(Id));
  }
  
  export function saveProfile(profile) {
    //clone
    const body = { ...profile };
    console.log(body);
   //update
   if (profile._id) {
     //delete _id
     delete body._id;
     return http.put(profileUrl(profile._id),body);
   }
 
   //add a new appointment
   return http.post(apiEndpoint, profile);
 }
  
  //delete appointments
  export function deleteProfile(Id) {
    return http.delete(profileUrl(Id));
  }  