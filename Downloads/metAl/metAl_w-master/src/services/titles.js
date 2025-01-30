import http from './httpService'; 
import {apiUrl} from './../config/config.json';
const apiEndpoint = apiUrl+'/titles';


  function titleUrl(id) {
    return `${apiEndpoint}/${id}`;
  }
  
  export function getTitles() {
    return http.get(apiEndpoint);
  }
  
  export function getTitle(Id) {
    return http.get(titleUrl(Id));
  }
  
  export function saveTitle(title) {
    //clone
    const body = { ...title };
    console.log(body);
   //update
   if (title.id) {
     //delete _id
     delete body.id;
     return http.put(titleUrl(title.id),body);
   }
 
   //add a new title
   return http.post(apiEndpoint, title);
 }
  
  //delete titles
  export function deleteTitle(Id) {
    return http.delete(titleUrl(Id));
  }  