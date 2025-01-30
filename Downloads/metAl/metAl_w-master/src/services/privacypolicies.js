import http from './httpService'; 
import {apiUrl} from './../config/config.json';
const apiEndpoint = apiUrl+'/privacypolicies';


  function privacypolicyUrl(id) {
    return `${apiEndpoint}/${id}`;
  }
  
  export function getPrivacyPolicies() {
    return http.get(apiEndpoint);
  }
  
  export function getPrivacyPolicy(Id) {
    return http.get(privacypolicyUrl(Id));
  }
  
  export function savePrivacyPolicy(privacypolicy) {
    //clone
    const body = { ...privacypolicy };
    console.log("about to save privacypolicy : " , body);
   //update
   if (privacypolicy._id) {
     delete body._id;
     return http.put(privacypolicyUrl(privacypolicy._id),body);
   }
 
   //add a new privacypolicie
   return http.post(apiEndpoint, privacypolicy);
 }
  
  //delete privacypolicies
  export function deletePrivacyPolicy(Id) {
    return http.delete(privacypolicyUrl(Id));
  }  