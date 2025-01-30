import http from "./httpService";
import { apiUrl } from "./../config/config.json";
const apiEndpoint = apiUrl + "/adminshifts";

function adminshiftUrl(id) {
	return `${apiEndpoint}/${id}`;
}

export function getAdminShifts() {
	return http.get(apiEndpoint);
}

export function getAdminShift(Id) {
	return http.get(adminshiftUrl(Id));
}

/* export function saveAdminShift(adminshift) {
	//clone
	const body = { ...adminshift };
	console.log("adminshift body", body);
	//update
	if (adminshift._id) {
		//delete _id
		delete body._id;
		return http.put(adminshiftUrl(adminshift._id), body);
	}

	//add a new adminshift
	return http.post(apiEndpoint, adminshift);
} */

export function saveAdminShift(adminshift,attachments) {
 
  const formData = new FormData(); 
 //update
 if (adminshift._id) {
   //clone adminshift and delete _id
   const body = { ...adminshift };
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
   return http.put(adminshiftUrl(adminshift._id), body);
 }
 
 const body = { ...adminshift };
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
 //add a new adminshift
 console.log(body)
 return http.post(apiEndpoint, body);
}


//delete adminshifts
export function deleteAdminShift(Id) {
	return http.delete(adminshiftUrl(Id));
}
