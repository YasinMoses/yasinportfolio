import { apiUrl } from "./../config/config.json";
import http from "./httpService";
const apiEndpoint = apiUrl + "/spots";

function spotUrl(id) {
    return `${apiEndpoint}/${id}`;
}

export function getSpots() {
    return http.get(apiEndpoint);
}

export function getSpot(Id) {
    return http.get(spotUrl(Id));
}

export function saveSpot(spot) {
    const formData = new FormData();
    //clone
    const coordinates = [39.210975, 60.722113];
    const body = { ...spot };

    //update

    if (spot._id) {
        const body = { ...spot };
        delete body._id;
        delete body.location;
        // body.push(coordinates);
        let obj = Object.assign(body, { coordinates });
        for (let key in body) {
            formData.append(key, body[key]);
        }
        console.log(obj, "body is");
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        return http.put(spotUrl(spot._id), obj);
    }

    for (let key in body) {
        formData.append(key, body[key]);
    }

    //add a new spot

    return http.post(apiEndpoint, body);
}

//delete spots
export function deleteSpot(Id) {
    return http.delete(spotUrl(Id));
}
