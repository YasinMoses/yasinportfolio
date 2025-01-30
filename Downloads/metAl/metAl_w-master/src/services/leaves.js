import http from "./httpService";
import { apiUrl } from "./../config/config.json";
const apiEndpoint = apiUrl + "/leaves";

function leaveUrl(id) {
	return `${apiEndpoint}/${id}`;
}

export function getLeaves() {
	return http.get(apiEndpoint);
}

export function getLeave(Id) {
	return http.get(leaveUrl(Id));
}



/* export function saveLeave(leave) {
	//clone
	const body = { ...leave };
	console.log("leave body", body);
	//update
	if (leave._id) {
		//delete _id
		delete body._id;
		return http.put(leaveUrl(leave._id), body);
	}

	//add a new leave
	return http.post(apiEndpoint, leave);
} */

export function saveLeave(leave,attachments) {
  const formData = new FormData(); 
 //update
 if (leave._id) {
   //clone leave and delete _id
   const body = { ...leave };
   delete body._id;
   for ( let key in body ) {
      formData.append(key, body[key]);
   }
     //formData.append('attachments', attachments);
     if(attachments){
       for(let x = 0; x<attachments.length; x++) {
        formData.append('attachments', attachments[x])
      }
     }
 console.log(attachments);
   return http.put(leaveUrl(leave._id), body);
 }
 const body = { ...leave };
 
    for ( let key in body ) {
      console.log(body[key])
      formData.append(key, body[key]);
      }
    
   //  formData.append('attachments', attachments);
   if(attachments){
    for(let x = 0; x<attachments.length; x++) {
   formData.append('attachments', attachments[x])
 }

  }else{
   formData.append('attachments', attachments);
 }
   //add a new leave
 return http.post(apiEndpoint, body);
}


//delete leaves
export function deleteLeave(Id) {
	return http.delete(leaveUrl(Id));
}
