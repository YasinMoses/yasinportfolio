import http from "./httpService";
import { apiUrl } from "./../config/config.json";
const apiEndpoint = apiUrl + "/certificates";

function certificateUrl(id) {
	return `${apiEndpoint}/${id}`;
}

export function getCertificates() {
	return http.get(apiEndpoint);
}

export function getCertificate(Id) {
	return http.get(certificateUrl(Id));
}

/* export function saveCertificate(certificate) {
	//clone
	const body = { ...certificate };
	console.log("certificate body", body);
	//update
	if (certificate._id) {
		//delete _id
		delete body._id;
		return http.put(certificateUrl(certificate._id), body);
	}

	//add a new certificate
	return http.post(apiEndpoint, certificate);
} */

export function saveCertificate(certificate,attachments) {
  const formData = new FormData(); 
  
 //update
 if (certificate._id) {
   //clone certificate and delete _id
   const body = { ...certificate };
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
   return http.put(certificateUrl(certificate._id), body);
 }

 const body = { ...certificate };
 
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
 //add a new certificate
 const config = {
  headers: {
    "Content-Type": "application/json"
  }
};
 return http.post(apiEndpoint, body);


}


//delete certificates
export function deleteCertificate(Id) {
	return http.delete(certificateUrl(Id));
}
