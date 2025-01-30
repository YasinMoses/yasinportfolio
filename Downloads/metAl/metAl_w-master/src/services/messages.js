import http from './httpService'; 
import {apiUrl} from './../config/config.json';

const apiEndpoint = apiUrl+'/messages';

  function messageUrl(id) {
    return `${apiEndpoint}/${id}`;
  }
  
  export function getMessages() {
    return http.get(apiEndpoint);
  }
  
  export function getMessagesByConversation(id) {
    return http.get(`${apiEndpoint}/conversation/${id}`);
  }

  export function getMessage(userId) {
    return http.get(messageUrl(userId));
  }
  
  export function saveMessage(message) {
    const body = { ...message };
   //update
   if (message._id) {
     //delete _id
     delete body._id;
     return http.put(messageUrl(message._id), body);
   }
   return http.post(apiEndpoint, body);
 }
 
  //delete 
  export function deleteMessage(messageId) {
    return http.delete(messageUrl(messageId));
  }  