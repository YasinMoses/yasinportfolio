import http from "./httpService";
// import { apiUrl } from "./../config/config.json";
import jwtDecode from "jwt-decode";

const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl + "/auth";
http.setJwt(getJwt());
//axios.defaults.headers.common['x-auth-token'] = localStorage.getItem('token');

export async function login(username, password) {
  const { data: jwt } = await http.post(apiEndpoint, { username, password });
  localStorage.setItem("token", jwt);
}
//after registration
export function loginWithJwt(jwt) {
  localStorage.setItem("token", jwt);
}

export function logout() {
  localStorage.removeItem("token");
}
//current user
export function getProfile() {
  try {
    const jwt = localStorage.getItem("token");
    return jwtDecode(jwt);
  } catch (ex) {
    return null;
  }
}

export function getJwt() {
  return localStorage.getItem("token");
}

export default {
  login,
  logout,
  getProfile,
  loginWithJwt,
  getJwt,
};
