import http from "./httpService";
import { apiUrl } from "./../config/config.json";
const apiEndpoint = apiUrl + "/adminskills";

function adminskillUrl(id) {
	return `${apiEndpoint}/${id}`;
}

export function getAdminSkills() {
	return http.get(apiEndpoint);
}

export function getAdminSkill(Id) {
	return http.get(adminskillUrl(Id));
}

/* export function saveAdminSkill(adminskill) {
	//clone
	const body = { ...adminskill };
	console.log("adminskill body", body);
	//update
	if (adminskill._id) {
		//delete _id
		delete body._id;
		return http.put(adminskillUrl(adminskill._id), body);
	}

	//add a new adminskill
	return http.post(apiEndpoint, adminskill);
} */

export function saveAdminSkill(adminskill,attachments) {
  const formData = new FormData(); 
  
 //update
 if (adminskill._id) {
   //clone adminskill and delete _id
   const body = { ...adminskill };
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
     const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };
   return http.put(adminskillUrl(adminskill._id), body);
 }

 const body = { ...adminskill };
 
 console.log(body)
 
    for ( let key in body ) {
      formData.append(key, body[key]);
      }
   //  formData.append('attachments', attachments);
   if(attachments){
 
    formData.append('imageSrc', attachments[0])
  
 }else{
  

  formData.append('imageSrc', attachments);
}
 //add a new adminskill
 const config = {
  headers: {
    "Content-Type": "application/json"
  }
};
 return http.post(apiEndpoint, body);


}


//delete adminskills
export function deleteAdminSkill(Id) {
	return http.delete(adminskillUrl(Id));
}
