import { apiUrl } from "./../config/config.json";
import http from "./httpService";
const apiEndpoint = apiUrl + "/admincertificates";

function admincertificateUrl(id) {
    return `${apiEndpoint}/${id}`;
}

export function getAdminCertificates() {
    return http.get(apiEndpoint);
}

export function getAdminCertificate(Id) {
    return http.get(admincertificateUrl(Id));
}

/* export function saveAdminCertificate(admincertificate) {
	//clone
	const body = { ...admincertificate };
	console.log("admincertificate body", body);
	//update
	if (admincertificate._id) {
		//delete _id
		delete body._id;
		return http.put(admincertificateUrl(admincertificate._id), body);
	}

	//add a new admincertificate
	return http.post(apiEndpoint, admincertificate);
} */

export function saveAdminCertificate(admincertificate, attachments) {
    const formData = new FormData();

    //update
    if (admincertificate._id) {
        //clone admincertificate and delete _id
        const body = { ...admincertificate };
        delete body._id;
        for (let key in body) {
            formData.append(key, body[key]);
        }
        //formData.append('attachments', attachments);
        if (attachments) {
            for (let x = 0; x < attachments.length; x++) {
                formData.append("attachments", attachments[x]);
            }
        }
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        return http.put(admincertificateUrl(admincertificate._id), body);
    }

    const body = { ...admincertificate };

    console.log(body);

    for (let key in body) {
        formData.append(key, body[key]);
    }
    //  formData.append('attachments', attachments);
    if (attachments) {
        formData.append("imageSrc", attachments[0]);
    } else {
        formData.append("imageSrc", attachments);
    }
    //add a new admincertificate
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };
    return http.post(apiEndpoint, body);
}

//delete admincertificates
export function deleteAdminCertificate(Id) {
    return http.delete(admincertificateUrl(Id));
}
