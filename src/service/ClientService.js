import {BASE_URL} from "../utils/config";
// export const clientApi = async (data) => {

//   try {
//     const token = localStorage.getItem("accessToken");

//     const response = await fetch(`${BASE_URL}/client/createClient`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}`,
//       },
//       body: JSON.stringify(data),
//     });
   
//     return response.json();
//   } catch (error) {
//     return Error
//   }


// };

export const clientApi = async (data) => {
  try {
    const token = localStorage.getItem("accessToken");

    const response = await fetch(`${BASE_URL}/client/createClient`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to create client.');
    }

    return { success: true, data: responseData };
  } catch (error) {
    return { success: false, error: error.message || 'An error occurred while creating the client.' };
  }
};


export const getAllClient = async () => {
  try {
    // Retrieve the token from local storage using the key
    const token = localStorage.getItem("accessToken");

    const response = await fetch(`${BASE_URL}/client/getAllClient`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    // console.log("token: is This Of This User" , accessToken);

    if (!response.ok) {
      throw new Error("Failed to fetch AllClients");
    }

    return response.json();
  } catch (error) {
    throw new Error("Error in getAllClientsService: " + error.message);
  }
};


export const updateClient = async (clientId, updatedData) => {
  try {
    const token = localStorage.getItem("accessToken");

    const response = await fetch(`${BASE_URL}/client/updateClient/${clientId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,

      },
      body: JSON.stringify(updatedData),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to Update client.');
    }

    return { success: true, data: responseData };
  } catch (error) {
    return { success: false, error: error.message || 'An error occurred while Updating the client.' };
  }
};
export const getSingleClient = async (clientId) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(`${BASE_URL}/client/getClient/${clientId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,

      },
     
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to create client.');
    }

    return { success: true, data: responseData };
  } catch (error) {
    return { success: false, error: error.message || 'An error occurred while creating the client.' };
  }
};

export const deleteClient = async (clientId) => {

  try {
    const token = localStorage.getItem("accessToken");

    const response = await fetch(`${BASE_URL}/client/deleteClient/${clientId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,

      },
     
    });

    if (!response.ok) {
      throw new Error(`Failed to get single Client ${clientId}`);
    }

    return response.json();
  } catch (error) {
    throw new Error("Error in getsingleClientService: " + error.message);
  }
};
