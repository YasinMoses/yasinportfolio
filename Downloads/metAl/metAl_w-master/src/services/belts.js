import http from './httpService';
const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl + '/belts';

function beltUrl(id) {
	return `${apiEndpoint}/${id}`;
}


export function getbelts() {
	return http.get(apiEndpoint);
}

export function getbelt(Id) {
	return http.get(beltUrl(Id));
}

//this need to be deleted
// function for belt image
export function getbeltImage(filePath) {
	return http.get(`${apiUrl}/${filePath}`);
}
// Function to upload the image

export async function savebelt(belt, file) {
	//clone
	const formData = new FormData();
	const body = { ...belt };
	//update
	if (file) {
		// const base64Image = await convertFileToBase64(file);
		formData.append('logoImage' , file);

		// console.log("logoImage in FormData:",formData.get('logoImage'));

	}
	if (belt._id && belt._id !== "new") {
		// delete _id
		delete body._id;
		for (let key in body) {
			formData.append(key, body[key]);
		}

		// for uploading files

		return http.put(
			beltUrl(belt._id),
			formData,{headers: {
			// 'Content-Type': 'multipart/form-data',
				'Content-Type': 'application/json; charset=utf-8',  // Ensures JSON response
			}}
		);
	}
	for (let key in body) {
		formData.append(key, body[key]);
	}
	//add a new belt
	return http.post(apiEndpoint, formData,{
		headers: {
			// 'Content-Type': 'multipart/form-data',
			'Content-Type': 'application/json; charset=utf-8',  // Ensures JSON response
		}
	});
}

//delete belt
export function deletebelt(Id) {
	return http.delete(beltUrl(Id));
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
