import http from './httpService'; 
import {apiUrl} from './../config/config.json';
const apiEndpoint = apiUrl+'/events';

export async function saveIncident(incident) {
    try {
      if (incident._id) {
        // If incident has ID, update existing incident
        const body = { ...incident };
        delete body._id;
        const response = await http.put(`${apiEndpoint}/${incident._id}`, body);
        return response.data;
      } else {
        // If no ID, create new incident
        const response = await http.post(apiEndpoint, incident);
        return response.data;
      }
    } catch (error) {
      console.error("Error saving incident:", error);
      throw error;
    }
  }

  export async function getIncidents() {
    try {
      const response = await http.get(apiEndpoint);
      return { data: response.data };
    } catch (error) {
      console.error("Error fetching incidents:", error);
      throw error;
    }
  }