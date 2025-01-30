import http from './httpService'; 
import {apiUrl} from './../config/config.json';
const apiEndpoint = apiUrl+'/carbrands';


  function carbrandUrl(id) {
    return `${apiEndpoint}/${id}`;
  }
  
  export function getCarBrands() {
    return http.get(apiEndpoint);
  }
  
  export function getCarBrand(Id) {
    return http.get(carbrandUrl(Id));
  }
  
  export function saveCarBrand(carbrand) {
    //clone
    const body = { ...carbrand };
    console.log(body);
   //update
   if (carbrand.id) {
     //delete _id
     delete body.id;
     return http.put(carbrandUrl(carbrand.id),body);
   }
 
   //add a new carbrand
   return http.post(apiEndpoint, carbrand);
 }
  
  //delete carbrands
  export function deleteCarBrand(Id) {
    return http.delete(carbrandUrl(Id));
  }  