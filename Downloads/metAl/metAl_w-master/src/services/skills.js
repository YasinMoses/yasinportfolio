import http from "./httpService";
import { apiUrl } from "./../config/config.json";
const apiEndpoint = apiUrl + "/skills";

function skillUrl(id) {
	return `${apiEndpoint}/${id}`;
}

export function getSkills() {
	return http.get(apiEndpoint);
}

export function getSkill(Id) {
	return http.get(skillUrl(Id));
}

/* export function saveSkill(skill) {
	//clone
	const body = { ...skill };
	console.log("skill body", body);
	//update
	if (skill._id) {
		//delete _id
		delete body._id;
		return http.put(skillUrl(skill._id), body);
	}

	//add a new skill
	return http.post(apiEndpoint, skill);
} */

export function saveSkill(skill,attachments) {
  const formData = new FormData(); 
  
 //update
 if (skill._id) {
   //clone skill and delete _id
   const body = { ...skill };
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
   return http.put(skillUrl(skill._id), body);
 }

 const body = { ...skill };
 
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
 //add a new skill
 const config = {
  headers: {
    "Content-Type": "application/json"
  }
};
 return http.post(apiEndpoint, body);


}


//delete skills
export function deleteSkill(Id) {
	return http.delete(skillUrl(Id));
}
