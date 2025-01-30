import http from './httpService'; 
// import {apiUrl} from './../config/config.json';
const apiUrl = process.env.REACT_APP_API_URL;

const apiEndpoint = apiUrl+'/modules';

  function moduleUrl(id) {
    return `${apiEndpoint}/${id}`;
  }
  
  export function getModules() {
    return http.get(apiEndpoint);
  }
  
  export function getModule(Id) {
    return http.get(moduleUrl(Id));
  }
  
  export function saveModule(module) {
    //clone
    const body = { ...module };
    console.log(body);
   //update
   if (module._id) {
     //delete _id
     delete body._id;
     return http.put(moduleUrl(module._id),body);
   }
 
   //add a new module
   return http.post(apiEndpoint, module);
 }
  
  //delete modules
  export function deleteModule(Id) {
    return http.delete(moduleUrl(Id));
  }  