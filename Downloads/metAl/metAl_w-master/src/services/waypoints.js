import { apiUrl } from "./../config/config.json";
import http from "./httpService";
const apiEndpoint = apiUrl + "/waypoints";

function waypointsUrl(id) {
    return `${apiEndpoint}/${id}`;
}

export function getWaypoints() {
    return http.get(apiEndpoint);
}

export function getWaypoint(Id) {
    return http.get(waypointsUrl(Id));
}

export function saveWaypoints(waypoints) {
    //clone
    const body = [...waypoints];
    //update
    if (waypoints._id) {
        //delete _id
        delete body._id;
        return http.put(waypointsUrl(waypoints._id), body);
    }
    //add a new eevent
    return http.post(apiEndpoint, body);
}

// update waypoint
export function updateWaypoint(id, body) {
    return http.put(waypointsUrl(id), body);
}

//delete eevents
export function deleteWaypoint(Id) {
    return http.delete(waypointsUrl(Id));
}
