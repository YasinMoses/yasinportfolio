import http from "./httpService";
import { apiUrl } from "./../config/config.json";
const apiEndpoint = apiUrl + "/shifts";

function shiftUrl(id) {
	return `${apiEndpoint}/${id}`;
}

export function getShifts() {
	return http.get(apiEndpoint);
}

export function getShift(Id) {
	return http.get(shiftUrl(Id));
}

/* export function saveShift(shift) {
	//clone
	const body = { ...shift };
	console.log("shift body", body);
	//update
	if (shift._id) {
		//delete _id
		delete body._id;
		return http.put(shiftUrl(shift._id), body);
	}

	//add a new shift
	return http.post(apiEndpoint, shift);
} */

export function saveShift(shift,attachments) {
 
  const formData = new FormData(); 
 //update
 if (shift._id) {
   //clone shift and delete _id
   const body = { ...shift };
   delete body._id;
   for ( let key in body ) {
      formData.append(key, body[key]);
   }
     //formData.append('attachments', attachments);
     if(attachments){
       for(let x = 0; x<attachments.length; x++) {
        formData.append('imageSrc', attachments[x])
      }
     }
 console.log(attachments);
   return http.put(shiftUrl(shift._id), body);
 }
 
 const body = { ...shift };
    for ( let key in body ) {
      formData.append(key, body[key]);
      }
      
   //  formData.append('attachments', attachments);
   if(attachments){
    for(let x = 0; x<attachments.length; x++) {
   formData.append('imageSrc', attachments[x])
 }

  }else{
   formData.append('imageSrc', attachments);
 }
 //add a new shift
 console.log(body)
 return http.post(apiEndpoint, body);
}


//delete shifts
export function deleteShift(Id) {
	return http.delete(shiftUrl(Id));
}
