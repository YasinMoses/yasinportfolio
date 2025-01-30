import { apiUrl } from "./../config/config.json";
import http from "./httpService";
const apiEndpoint = apiUrl + "/drills";

function areaUrl(id) {
    return `${apiEndpoint}/${id}`;
}

export function getDrills() {
    return http.get(apiEndpoint);
}

export function getDrill(Id) {
    return http.get(drillUrl(Id));
}

export function saveDrill(drill) {
    const formData = new FormData();
    //clone
    const body = { ...drill };

    //update

    if (drill._id) {
        const body = { ...drill };
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

        return http.put(drillUrl(drill._id), obj);
    }

    for (let key in body) {
        formData.append(key, body[key]);
    }

    //add a new drill

    return http.post(apiEndpoint, body);
}

//delete drills
export function deleteDrill(Id) {
    return http.delete(drillUrl(Id));
}
