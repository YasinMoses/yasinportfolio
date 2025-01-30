import http from './httpService'; 
import {apiUrl} from './../config/config.json';
const apiEndpoint = apiUrl+'/incidentcategories';


  function incidentcategoryUrl(id) {
    return `${apiEndpoint}/${id}`;
  }
  
  export function getIncidentCategories() {
    return http.get(apiEndpoint);
  }
  
  export function getIncidentCategory(Id) {
    return http.get(incidentcategoryUrl(Id));
  }
  
  export function saveIncidentCategory(incidentcategory) {
    //clone
    const body = { ...incidentcategory };
    console.log("about to save incidentcategory : " , body);
   //update
   if (incidentcategory._id) {
     delete body._id;
     return http.put(incidentcategoryUrl(incidentcategory._id),body);
   }
 
   //add a new incidentcategory
   return http.post(apiEndpoint, incidentcategory);
 }
  
  //delete incidentcategorys
  export function deleteIncidentCategory(Id) {
    return http.delete(incidentcategoryUrl(Id));
  }  