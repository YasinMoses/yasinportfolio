import http from './httpService';
const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = apiUrl + '/services';


function serviceUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getServices() {
  return http.get(apiEndpoint);
}

export function getService(Id) {
  return http.get(serviceUrl(Id));
}

export function saveService(service, attachments, onUploadProgress) {
  const formData = new FormData();
  //clone
  const body = { ...service };
  const config = {
    onUploadProgress: (progressEvent) =>
      //onUploadProgress(Math.trunc(progressEvent.loaded / progressEvent.total)),
      onUploadProgress(progressEvent.loaded / progressEvent.total),
  };

  //update
  if (service._id) {
    //delete _id
    delete body._id;
    delete body.attachments;
    for (let key in body) {
      formData.append(key, body[key]);
    }

    // for uploading files
    if (attachments != null || undefined && attachments.length > 0) {
      for (let x = 0; x <= attachments.length; x++) {
        formData.append('attachments', attachments[x])
      }
    }

    return http.put(serviceUrl(service._id), formData, config);
  }
  for (let key in body) {
    formData.append(key, body[key]);
  }
  if (attachments.length > 0) {
    for (let x = 0; x <= attachments.length; x++) {
      formData.append('attachments', attachments[x])
    }
  } else {
    formData.append('attachments', attachments);
  }

  //add a new service
  return http.post(apiEndpoint, formData, config);
}

//delete services
export function deleteService(Id) {
  return http.delete(serviceUrl(Id));
}  