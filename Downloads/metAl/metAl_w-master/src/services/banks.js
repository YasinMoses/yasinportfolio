import http from './httpService'; 
// import {apiUrl} from './../config/config.json';
const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl+'/banks';


  function bankUrl(id) {
    return `${apiEndpoint}/${id}`;
  }
  
  export function getBanks() {
    return http.get(apiEndpoint);
  }
  
  export function getBank(Id) {
    return http.get(bankUrl(Id));
  }
  
  export function saveBank(bank) {
    //clone
    const body = { ...bank };
    console.log(body);
   //update
   if (bank.id) {
     //delete _id
     delete body.id;
     return http.put(bankUrl(bank.id),body);
   }
 
   //add a new bank
   return http.post(apiEndpoint, bank);
 }
  
  //delete banks
  export function deleteBank(Id) {
    return http.delete(bankUrl(Id));
  }  