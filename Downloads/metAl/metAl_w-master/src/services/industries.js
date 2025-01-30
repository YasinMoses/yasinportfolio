import http from './httpService';
const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl + '/industries';

function industryUrl(id) {
	return `${apiEndpoint}/${id}`;
}


export function getindustries() {
	return http.get(apiEndpoint);
}

export function getIndustry(Id) {
	return http.get(industryUrl(Id));
}

//this need to be deleted
// function for industry image
export function getindustryImage(filePath) {
	return http.get(`${apiUrl}/${filePath}`);
}
// Function to upload the image

export async function saveIndustry(industry, file) {
	//clone
	const formData = new FormData();
	const body = { ...industry };
	//update
	if (file) {
		const base64Image = await convertFileToBase64(file);
		formData.append('logoImage' , file);

		// console.log("logoImage in FormData:",formData.get('logoImage'));

	}
	if (industry._id && industry._id !== "new") {
		// delete _id
		delete body._id;
		for (let key in body) {
			formData.append(key, body[key]);
		}

		// for uploading files

		return http.put(
			industryUrl(industry._id),
			formData,{headers: {
			// 'Content-Type': 'multipart/form-data',
				'Content-Type': 'application/json; charset=utf-8',  // Ensures JSON response
			}}
		);
	}
	for (let key in body) {
		formData.append(key, body[key]);
	}
	//add a new industry
	return http.post(apiEndpoint, formData,{
		headers: {
			// 'Content-Type': 'multipart/form-data',
			'Content-Type': 'application/json; charset=utf-8',  // Ensures JSON response
		}
	});
}

//delete industry
export function deleteindustry(Id) {
	return http.delete(industryUrl(Id));
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
