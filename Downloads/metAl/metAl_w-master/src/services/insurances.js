import http from './httpService'; 
// import {apiUrl} from './../config/config.json';
const apiUrl = process.env.REACT_APP_API_URL;

const apiEndpoint = apiUrl+'/insurances';


  function insuranceUrl(id) {
    return `${apiEndpoint}/${id}`;
  }
  
  export function getInsurances() {
    return http.get(apiEndpoint);
  }
  
  export function getInsurance(Id) {
    return http.get(insuranceUrl(Id));
  }
  
  export function saveInsurance(insurance) {
    //clone
    const body = { ...insurance };
    console.log(body);
   //update
   if (insurance.id) {
     //delete _id
     delete body.id;
     return http.put(insuranceUrl(insurance.id),body);
   }
 
   //add a new insurance
   return http.post(apiEndpoint, insurance);
 }
  
  //delete insurances
  export function deleteInsurance(Id) {
    return http.delete(insuranceUrl(Id));
  }  