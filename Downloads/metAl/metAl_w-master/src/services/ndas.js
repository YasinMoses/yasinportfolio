import http from './httpService'; 
import {apiUrl} from './../config/config.json';
const apiEndpoint = apiUrl+'/ndas';


  function ndaUrl(id) {
    return `${apiEndpoint}/${id}`;
  }
  
  export function getNDAs() {
    return http.get(apiEndpoint);
  }
  
  export function getNDA(Id) {
    return http.get(ndaUrl(Id));
  }
  
  export function saveNDA(nda) {
    //clone
    const body = { ...nda };
    console.log("about to save nda : " , body);
   //update
   if (nda._id) {
     delete body._id;
     return http.put(ndaUrl(nda._id),body);
   }
 
   //add a new nda
   return http.post(apiEndpoint, nda);
 }
  
  //delete ndas
  export function deleteNDA(Id) {
    return http.delete(ndaUrl(Id));
  }  