import http from './httpService'; 
import {apiUrl} from './../config/config.json';
const apiEndpoint = apiUrl+'/reviews';


  function reviewUrl(id) {
    return `${apiEndpoint}/${id}`;
  }
  
  export function getreviews() {
    return http.get(apiEndpoint);
  }
  
  export function getreview(Id) {
    return http.get(reviewUrl(Id));
  }
  
  export function savereview(review) {
    //clone
    const body = { ...review };
    console.log(body);
   //update
   if (review._id) {
     //delete _id
     delete body._id;
     return http.put(reviewUrl(review._id),body);
   }
 
   //add a new review
   return http.post(apiEndpoint, review);
 }
  
  //delete reviews
  export function deletereview(Id) {
    return http.delete(reviewUrl(Id));
  }  