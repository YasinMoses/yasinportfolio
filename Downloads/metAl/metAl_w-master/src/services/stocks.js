import http from './httpService'; 
import {apiUrl} from './../config/config.json';
const apiEndpoint = apiUrl+'/stocks';


  function stockUrl(id) {
    return `${apiEndpoint}/${id}`;
  }
  
  export function getStocks() {
    return http.get(apiEndpoint);
  }
  
  export function getStock(Id) {
    return http.get(stockUrl(Id));
  }
  
  export function saveStock(stock) {
    //clone
    const body = { ...stock };
    console.log(body);
   //update
   if (stock._id) {
     //delete _id
     delete body._id;
     return http.put(stockUrl(stock._id),body);
   }
 
   //add a new stock
   return http.post(apiEndpoint, stock);
 }
  
  //delete stocks
  export function deleteStock(Id) {
    return http.delete(stockUrl(Id));
  }  