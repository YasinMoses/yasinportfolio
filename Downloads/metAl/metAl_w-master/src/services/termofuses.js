import http from './httpService'; 
import {apiUrl} from './../config/config.json';
const apiEndpoint = apiUrl+'/termofuses';


  function termofuseUrl(id) {
    return `${apiEndpoint}/${id}`;
  }
  
  export function getTermOfUses() {
    return http.get(apiEndpoint);
  }
  
  export function getTermOfUse(Id) {
    return http.get(termofuseUrl(Id));
  }
  
  export function saveTermOfUse(termofuse) {
    //clone
    const body = { ...termofuse };
    console.log("about to save termofuse : " , body);
   //update
   if (termofuse._id) {
     delete body._id;
     return http.put(termofuseUrl(termofuse._id),body);
   }
 
   //add a new termofuse
   return http.post(apiEndpoint, termofuse);
 }
  
  //delete termofuses
  export function deleteTermOfUse(Id) {
    return http.delete(termofuseUrl(Id));
  }  