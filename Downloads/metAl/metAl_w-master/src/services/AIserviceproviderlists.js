import http from './httpService';
// import { apiUrl } from './../config/config.json';
const apiUrl = process.env.REACT_APP_API_URL;

const apiEndpoint = apiUrl + '/aiserviceproviderlists';

function AIserviceproviderlistUrl(id) {
	return `${apiEndpoint}/${id}`;
}


export function getAIServiceProviderLists() {
	return http.get(apiEndpoint);
}

export function getAIServiceProviderList(Id) {
	return http.get(AIserviceproviderlistUrl(Id));
}

//this need to be deleted
// function for AIserviceproviderlist image
export function getAIServiceProviderListImage(filePath) {
	return http.get(`${apiUrl}/${filePath}`);
}
// Function to upload the image

export async function saveAIServiceProviderList(AIserviceproviderlist, file) {
	//clone
	const formData = new FormData();
	const body = { ...AIserviceproviderlist };
	//update
	if (file) {
		// const base64Image = await convertFileToBase64(file);
		formData.append('logoImage' , file);

		// console.log("logoImage in FormData:",formData.get('logoImage'));

	}
	if (AIserviceproviderlist._id && AIserviceproviderlist._id !== "new") {
		// delete _id
		delete body._id;
		for (let key in body) {
			formData.append(key, body[key]);
		}

		// for uploading files

		return http.put(
			AIserviceproviderlistUrl(AIserviceproviderlist._id),
			formData,{headers: {
			 'Content-Type': 'multipart/form-data',
				//'Content-Type': 'application/json; charset=utf-8',  // Ensures JSON response
			}}
		);
	}
	for (let key in body) {
		formData.append(key, body[key]);
	}
	//add a new AIServiceProviderList
	return http.post(apiEndpoint, formData,{
		headers: {
			 'Content-Type': 'multipart/form-data',
			//'Content-Type': 'application/json; charset=utf-8',  // Ensures JSON response
		}
	});
}

//delete AIserviceproviderlist
export function deleteAIServiceProviderList(Id) {
	return http.delete(AIserviceproviderlistUrl(Id));
}

// Utility function to convert file to Base64
function convertFileToBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});
}
