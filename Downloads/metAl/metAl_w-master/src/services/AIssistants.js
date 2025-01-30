import http from "./httpService";
const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl + "/AIssistants";

function AIssistantUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getAISsistants() {
  return http.get(apiEndpoint);
}

export function getAISsistant(Id) {
  return http.get(AIssistantUrl(Id));
}

//this need to be deleted
// function for AIssistant image
export function getAISsistantImage(filePath) {
  return http.get(`${apiUrl}/${filePath}`);
}

export function saveAISsistant(AIssistant, files) {
  const formData = new FormData();
  const body = { ...AIssistant };

  // console.log("from service: ", body);

  if (AIssistant._id) {
    // If editing an existing AIssistant
    delete body._id;
    delete body.imageSrc;
    // console.log("image from service,",files);

    for (let key in body) {
      if (Array.isArray(body[key])) {
        // Handle arrays like AIServiceProviderNO
        body[key].forEach((item) => {
          formData.append(`${key}[]`, item); // Append each array item
        });
      } else {
        formData.append(key, body[key]);
      }
    }

    // Handle files
    if (files) {
      // for (let x = 0; x < files.length; x++) {
        formData.append("imageSrc", files);
        // console.log("updating from service");
      // }
    }

    return http.put(AIssistantUrl(AIssistant._id), formData,{
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  // For new AIssistant
  for (let key in body) {
    if (key === "AIServiceProviderNO" && Array.isArray(body[key])) {
      body[key].forEach((item) => {
        formData.append(`${key}[]`, item); // Append each array item
      });
    } else if (key !== "imageSrc") {
      formData.append(key, body[key]);
    }
  }

  if (files) {
    formData.append("imageSrc", files);
  }

  // console.log("new add", formData);
  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }

  return http.post(apiEndpoint, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}


//delete AIssistant
export function deleteAISsistant(Id) {
  return http.delete(AIssistantUrl(Id));
}
