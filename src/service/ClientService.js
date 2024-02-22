export const clientApi = async (data) => {
  const token = localStorage.getItem("accessToken");

  const response = await fetch("http://localhost:3010/client/createClient", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to Client Post Data");
  }

  return response.json();
};

export const getAllClient = async () => {
  try {
    // Retrieve the token from local storage using the key
    const token = localStorage.getItem("accessToken");

    const response = await fetch("http://localhost:3010/client/getAllClient", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    // console.log("token: is This Of This User" , accessToken);

    if (!response.ok) {
      throw new Error("Failed to fetch all AllClients");
    }

    return response.json();
  } catch (error) {
    throw new Error("Error in getAllClientsService: " + error.message);
  }
};


export const updateClient = async (clientId, updatedData) => {
  try {
    const token = localStorage.getItem("accessToken");

    const response = await fetch(`http://localhost:3010/client/updateClient/${clientId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,

      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      throw new Error("Failed to update Client");
    }

    return response.json();
  } catch (error) {
    throw new Error("Error in updateClientService: " + error.message);
  }
};
export const getSingleClient = async (clientId) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(`http://localhost:3010/client/getClient/${clientId}`, {
      method: "GET",
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
};export const deleteClient = async (clientId) => {

  try {
    const token = localStorage.getItem("accessToken");

    const response = await fetch(`http://localhost:3010/client/deleteClient/${clientId}`, {
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
