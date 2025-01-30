import http from './httpService'; 
import {apiUrl} from './../config/config.json';
const apiEndpoint = apiUrl+'/emailtemplates';


  function mailTemplateUrl(id) {
    return `${apiEndpoint}/${id}`;
  }
  
  export function getMailTemplates() {
    return http.get(apiEndpoint);
  }
  
  export function getMailTemplate(Id) {
    return http.get(mailTemplateUrl(Id));
  }
  
  export function saveMailTemplate(data) {
    //clone
    const body = { ...data };
    console.log(body);
   //update
   if (data.id) {
     //delete _id
     delete body.id;
     return http.put(mailTemplateUrl(data.id),body);
   }
 
   //add a new 
   return http.post(apiEndpoint, data);
 }
  
  //delete 
  export function deleteMailTemplate(Id) {
    return http.delete(mailTemplateUrl(Id));
  }  