import axios from "axios";
import http from "./httpService";
// import { apiUrl } from "./../config/config.json";
import { toast } from "react-toastify";

const apiUrl = process.env.REACT_APP_API_URL;

const apiEndpoint = apiUrl + "/users";

// export async function getUsers(){
// const response = await http.get("http://localhost:4500/api/users");
// return response;
//   }
function userUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getUsers() {
  return http.get(apiEndpoint);
}

export function getUser(userId) {
  return http.get(userUrl(userId));
}

export function saveUser(user, imageSrc) {
  const formData = new FormData();
  //update
  if (user._id) {
    //clone user and delete _id
    const body = { ...user };
    delete body._id;
    for (let key in body) {
      formData.append(key, body[key]);
    }
    formData.append("imageSrc", imageSrc);
    return http.put(userUrl(user._id), formData);
  }
  const body = { ...user };
  for (let key in body) {
    formData.append(key, body[key]);
  }
  formData.append("imageSrc", imageSrc);
  //add a new user
  return http.post(apiEndpoint, formData);
}

//patch users
// export function patchUser(user, imageSrc) {
//   const formData = new FormData();
//   //update
//   if (user._id) {
//     const body = { ...user };
//     delete body._id;
//     delete body.imageSrc;
//     for (let key in body) {
//       formData.append(key, body[key]);
//     }
//     formData.append("imageSrc", imageSrc);
//     console.log(body);
//     console.log(Array.from(formData));
//     return axios.patch(
//       `http://127.0.0.1:4400/api/users/${user._id}`,
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );
//   }
// }
// Remove the _id and imageSrc properties from the user object

// // Append the image to the formData object
// formData.append("image", imageSrc);
export async function patchUser(user) {
  // Update user
  const token = localStorage.getItem("token");
  const { _id, imageSrc, ...userWithoutIdAndImage } = user;

  // Append each property in userWithoutIdAndImage to the formData object

  if (_id) {
    try {
      const response = await axios.patch(userUrl(_id), user, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      toast.success("Contact Updated Successfully");
      return response.data;
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  }
}

//delete users
export function deleteUser(userId) {
  return http.delete(userUrl(userId));
}
