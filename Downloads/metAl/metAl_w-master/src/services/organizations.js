import http from './httpService'; 
const apiUrl = process.env.REACT_APP_API_URL;
// import {apiUrl} from './../config/config.json';
const apiEndpoint = apiUrl+'/organizations';
  function organizationUrl(id) {
    return `${apiEndpoint}/${id}`;
  }
  
  export function getOrganizations() {
    return http.get(apiEndpoint);
  }
  
  export function getOrganization(Id) {
    return http.get(organizationUrl(Id));
  }
  
  export function saveOrganization(organization) {
    //clone
    const body = { ...organization };
    console.log(body);
   //update
   if (organization.id) {
     //delete _id
     delete body.id;
     return http.put(organizationUrl(organization.id),body);
   }
 
   //add a new organization
   return http.post(apiEndpoint, organization);
 }
  
  //delete organizations
  export function deleteOrganization(Id) {
    return http.delete(organizationUrl(Id));
  }  