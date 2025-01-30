import http from './httpService'; 
import {apiUrl} from './../config/config.json';
const apiEndpoint = apiUrl+'/AIMLsettings';


  function AIMLsettingUrl(id) {
    return `${apiEndpoint}/${id}`;
  }
  
  export function getAccountingSettings() {
    return http.get(apiEndpoint);
  }

  export function getMyAccountingSetting() {
    return http.get(apiEndpoint+'/me');
  }
  
  export function getAccountingSetting(Id) {
    return http.get(AIMLsettingUrl(Id));
  }
  
  export function saveAccountingSetting(AIMLsetting) {
    //clone
    const body = { ...AIMLsetting };
    console.log(body);
   //update
   if (AIMLsetting._id) {
     //delete _id
     delete body._id;
     return http.put(AIMLsettingUrl(AIMLsetting._id),body);
   }
}
 
  //delete AIMLsettings
  export function deleteAccountingSetting(Id) {
    return http.delete(AIMLsettingUrl(Id));
  }  