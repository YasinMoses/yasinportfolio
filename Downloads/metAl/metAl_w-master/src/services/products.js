import http from './httpService';
// import { apiUrl } from './../config/config.json';
const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl + '/products';

function productUrl(id) {
	return `${apiEndpoint}/${id}`;
}

export function getProducts() {
	return http.get(apiEndpoint);
}

export function getProduct(Id) {
	return http.get(productUrl(Id));
}

//this need to be deleted
// function for product image
export function getProductImage(filePath) {
	return http.get(`${apiUrl}/${filePath}`);
}

export function saveProduct(product, files) {
	//clone
	const formData = new FormData();
	const body = { ...product };
	//update
	if (product._id) {
		// delete _id
		delete body._id;
		delete body.ImageSrc;
		for (let key in body) {
			formData.append(key, body[key]);
		}

		// for uploading files
		if (files != null || undefined && files.length > 0) {
			for (let x = 0; x < files.length; x++) {
				formData.append('imageSrc', files[x])
			}
		}


		return http.put(productUrl(product._id), formData);
	}
	for (let key in body) {
		formData.append(key, body[key]);
	}
	if (files.length > 0) {
		for (let x = 0; x < files.length; x++) {
			formData.append('ImageSrc', files[x])
		}
	} else {
		formData.append('ImageSrc', files);
	}
	//add a new Product
	console.log("new add", formData)
	return http.post(apiEndpoint, formData);
}

//delete products
export function deleteProduct(Id) {
	return http.delete(productUrl(Id));
}