import http from './httpService'; 
const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl+'/ticketcategories';


  function ticketcategoryUrl(id) {
    return `${apiEndpoint}/${id}`;
  }
  
  export function getTicketCategories() {
    return http.get(apiEndpoint);
  }
  
  export function getTicketCategory(Id) {
    return http.get(ticketcategoryUrl(Id));
  }
  
  export function saveTicketCategory(ticketcategory) {
    //clone
    const body = { ...ticketcategory };
    console.log(body);
   //update
   if (ticketcategory._id) {
     //delete _id
     delete body._id;
     return http.put(ticketcategoryUrl(ticketcategory._id),body);
   }
 
   //add a new ticketcategory
   return http.post(apiEndpoint, ticketcategory);
 }
  
  //delete ticketcategorys
  export function deleteTicketCategory(Id) {
    return http.delete(ticketcategoryUrl(Id));
  }  