import http from './httpService'; 
// import {apiUrl} from './../config/config.json';
const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl+'/tasks';

  function taskUrl(id) {
    return `${apiEndpoint}/${id}`;
  }
  
  export function getTasks() {
    return http.get(apiEndpoint);
  }
  
  export function getTask(Id) {
    return http.get(taskUrl(Id));
  }
  
  export function saveTask(task) {
    //clone
    const body = { ...task };
    console.log(body);
   //update
   if (task._id) {
     //delete _id
     delete body._id;
     return http.put(taskUrl(task._id),body);
   }
 
   //add a new task
   return http.post(apiEndpoint, task);
 }
  
  //delete tasks
  export function deleteTask(Id) {
    return http.delete(taskUrl(Id));
  }  