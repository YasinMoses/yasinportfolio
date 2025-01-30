import { apiUrl } from "./../config/config.json";
import http from "./httpService";
const apiEndpoint = apiUrl + "/floors";

function floorUrl(id) {
    return `${apiEndpoint}/${id}`;
}

export function getFloors() {
    return http.get(apiEndpoint);
}

export function getFloor(Id) {
    return http.get(floorUrl(Id));
}

export function saveFloor(eevent, attachments, onUploadProgress) {
    console.log(eevent);
    const formData = new FormData();
    //clone
    const body = { ...eevent };
    // const config = {
    //     onUploadProgress: (progressEvent) =>
    //         //onUploadProgress(Math.trunc(progressEvent.loaded / progressEvent.total)),
    //         onUploadProgress(progressEvent.loaded / progressEvent.total),
    // };

    //update
    if (eevent._id) {
        //delete _id
        delete body._id;
        delete body.attachments;
        for (let key in body) {
            formData.append(key, body[key]);
        }

        // for uploading files
        if (attachments != null || (undefined && attachments.length > 0)) {
            for (let x = 0; x <= attachments.length; x++) {
                formData.append("attachments", attachments[x]);
            }
        }
        console.log(body);
        return http.put(floorUrl(eevent._id), formData);
    }
    for (let key in body) {
        formData.append(key, body[key]);
    }
    // if (attachments.length > 0) {
    //     for (let x = 0; x <= attachments.length; x++) {
    //         formData.append("attachments", attachments[x]);
    //     }
    // } else {
    //     formData.append("attachments", attachments);
    // }

    //add a new eevent
    return http.post(apiEndpoint, formData);
}

//delete eevents
export function deleteFloor(Id) {
    return http.delete(floorUrl(Id));
}
