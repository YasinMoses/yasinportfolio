import http from './httpService';

const apiUrl = process.env.REACT_APP_API_URL;
const apiEndpoint = `${apiUrl}/AIMLtasks`;

function AIMLTaskUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getAIMLTasks() {
  console.log("API Endpoint:", apiEndpoint);
  return http.get(apiEndpoint).catch(error => {
    console.error("Error fetching AIML Tasks:", error.response || error.message);
    // Log the full error to diagnose the issue
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    throw error;
  });
}

export function getAIMLTask(id) {
  if (!id) {
    console.error("Invalid ID passed to getAIMLTask.");
    return Promise.reject("Invalid ID.");
  }
  console.log("Fetching AIML Task ID:", id);
  return http.get(AIMLTaskUrl(id)).catch(error => {
    console.error(`Error fetching AIML Task with ID ${id}:`, error.response || error.message);
    // Log response data to help debug
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    throw error;
  });
}

export async function saveAIMLTask(AIMLTask, file) {
  const formData = new FormData();
  const body = { ...AIMLTask };

  if (file) {
    formData.append('attachment', file);
  }

  if (AIMLTask._id && AIMLTask._id !== 'new') {
    delete body._id;
    for (let key in body) {
      formData.append(key, body[key]);
    }

    console.log("Updating AIML Task with ID:", AIMLTask._id);
    return http.put(AIMLTaskUrl(AIMLTask._id), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).catch(error => {
      console.error(`Error updating AIML Task with ID ${AIMLTask._id}:`, error.response || error.message);
      // Log response data to help debug
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
      throw error;
    });
  }

  for (let key in body) {
    formData.append(key, body[key]);
  }

  console.log("Creating a new AIML Task");
  return http.post(apiEndpoint, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).catch(error => {
    console.error("Error creating AIML Task:", error.response || error.message);
    // Log response data to help debug
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    throw error;
  });
}

export function deleteAIMLTask(id) {
  if (!id) {
    console.error("Invalid ID passed to deleteAIMLTask.");
    return Promise.reject("Invalid ID.");
  }
  console.log("Deleting AIML Task with ID:", id);
  return http.delete(AIMLTaskUrl(id)).catch(error => {
    console.error(`Error deleting AIML Task with ID ${id}:`, error.response || error.message);
    // Log response data to help debug
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    throw error;
  });
}

// Utility function to convert file to Base64
function convertFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
