import http from './httpService'; 
const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl+'/events';


  function eventUrl(id) {
    return `${apiEndpoint}/${id}`;
  }
  
  export function getEvents() {
    return http.get(apiEndpoint);
  }
  
  export function getEvent(Id) {
    return http.get(eventUrl(Id));
  }
  
  export function saveEvent(event) {
    //clone
    const body = { ...event };
    console.log(body);
   //update
   if (event._id) {
     //delete _id
     delete body._id;
     return http.put(eventUrl(event._id),body);
   }
 
   //add a new event
   return http.post(apiEndpoint, event);
 }
  
  //delete events
  export function deleteEvent(Id) {
    return http.delete(eventUrl(Id));
  }  