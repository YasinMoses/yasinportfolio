import http from './httpService'; 
import {apiUrl} from './../config/config.json';
const apiEndpoint = apiUrl+'/cookies';


  function cookieUrl(id) {
    return `${apiEndpoint}/${id}`;
  }
  
  export function getCookies() {
    return http.get(apiEndpoint);
  }
  
  export function getCookie(Id) {
    return http.get(cookieUrl(Id));
  }
  
  export function saveCookie(cookie) {
    //clone
    const body = { ...cookie };
    console.log("about to save cookie : " , body);
   //update
   if (cookie._id) {
     delete body._id;
     return http.put(cookieUrl(cookie._id),body);
   }
 
   //add a new cookie
   return http.post(apiEndpoint, cookie);
 }
  
  //delete cookies
  export function deleteCookie(Id) {
    return http.delete(cookieUrl(Id));
  }  