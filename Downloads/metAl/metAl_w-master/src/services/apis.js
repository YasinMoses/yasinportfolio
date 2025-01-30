import http from "./httpService";
import { apiUrl } from "./../config/config.json";
const apiEndpoint = apiUrl + "/apis";

export function apisUrl(id) {
	return `${apiEndpoint}/${id}`;
}

export function getAPIs() {
	return http.get(apiEndpoint);
}

export function getAPI(Id) {
	return http.get(`${apiEndpoint}/${Id}`);
}

export function saveAPI(api) {
	//clone
	const body = { ...api };
	body.domains = body.domains.split(" ")
	//update
	if (api._id) {
		//delete _id
		delete body._id;
		return http.put(apiEndpoint +"/" + api._id, body);
	}

	//add a new api
	return http.post(apiEndpoint, api);
}

//delete apis
export function deleteAPI(Id) {
	return http.delete(apisUrl(Id));
}
