import http from './httpService';
// import { apiUrl } from './../config/config.json';
const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl + '/aiserviceproviders';

function AIserviceproviderUrl(id) {
	return `${apiEndpoint}/${id}`;
}

export function getAIServiceProviders() {
	return http.get(apiEndpoint);
}

export function getAIServiceProvider(Id) {
	return http.get(AIserviceproviderUrl(Id));
}

//this need to be deleted
// function for AIserviceprovider image
export function getAIServiceProviderImage(filePath) {
	return http.get(`${apiUrl}/${filePath}`);
}


export function saveAIServiceProvider(AIserviceprovider) {
	//clone
	// const formData = new FormData();
	const body = { ...AIserviceprovider };
	//update
	if (AIserviceprovider._id && AIserviceprovider._id!=="new") {
		// delete _id
		delete body._id;
		// delete body.ImageSrc;
		// for (let key in body) {
		// 	formData.append(key, body[key]);
		// }
		// for uploading files
		// if (files != null || undefined && files.length > 0) {
		// 	for (let x = 0; x < files.length; x++) {
		// 		formData.append('imageSrc', files[x])
		// 	}
		// }
		return http.put(AIserviceproviderUrl(AIserviceprovider._id),body,{
			headers:{
				'Content-Type': 'application/json; charset=utf-8',
			}
		});
	}
	// for (let key in body) {
	// 	formData.append(key, body[key]);
	// }
	//add a new AIServiceProvider
	// console.log("new add", formData)
	return http.post(apiEndpoint, body,{
		headers:{
			'Content-Type': 'application/json; charset=utf-8',
		}
	});
	  
}

//delete AIserviceprovider
export function deleteAIServiceProvider(Id) {
	return http.delete(AIserviceproviderUrl(Id));
}
