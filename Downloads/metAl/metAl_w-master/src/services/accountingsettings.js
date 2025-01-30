import http from './httpService'; 
import {apiUrl} from './../config/config.json';
const apiEndpoint = apiUrl+'/accountingsettings';


  function accountingsettingUrl(id) {
    return `${apiEndpoint}/${id}`;
  }
  
  export function getAccountingSettings() {
    return http.get(apiEndpoint);
  }
  
  export function getAccountingSetting(Id) {
    return http.get(accountingsettingUrl(Id));
  }
  
  export function saveAccountingSetting(accountingsetting) {
    //clone
    const body = { ...accountingsetting };
    console.log(body);
   //update
   if (accountingsetting.id) {
     //delete _id
     delete body.id;
     return http.put(accountingsettingUrl(accountingsetting.id),body);
   }
 
   //add a new accountingsetting
   return http.post(apiEndpoint, accountingsetting);
 }
  
  //delete accountingsettings
  export function deleteAccountingSetting(Id) {
    return http.delete(accountingsettingUrl(Id));
  }  