import axiosInstance from './axios';

export const clientApi = async (data) => {
  try {
    const token = localStorage.getItem("accessToken");

    const response = await axiosInstance.post(`/client/createClient`, data, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      }
    });

    return { success: true, data: response.data };
  } catch (error) {

    let errorMessage = 'An error occurred while creating the client.';
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }

    return { success: false, error: errorMessage };
  }
};
export const getAllClient = async () => {
  try {
    const token = localStorage.getItem('accessToken');

    const response = await axiosInstance.get('/client/getAllClient', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log("response",response)
    return { success: true, data: response };
  } catch (error) {
    let errorMessage = 'An error occurred while getting All the client';
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }

    return { success: false, error: errorMessage };
  }
};

export const updateClient = async (clientId, updatedData) => {
  try {
    const token = localStorage.getItem("accessToken");

    const response = await axiosInstance.put(`/client/updateClient/${clientId}`, updatedData, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      }
    });

    return { success: true, data: response.data };
  } catch (error) {
    let errorMessage = 'An error occurred while updating the client.';
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }

    return { success: false, error: errorMessage };
  }
};

export const getSingleClient = async (clientId) => {
  try {
    const token = localStorage.getItem("accessToken");

    const response = await axiosInstance.get(`/client/getClient/${clientId}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      }
    });

    return { success: true, data: response };
  } catch (error) {
    let errorMessage = 'An error occurred while getting single client.';
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }

    return { success: false, error: errorMessage };
  }
};

export const deleteClient = async (clientId) => {
  try {
    const token = localStorage.getItem("accessToken");

    const response = await axiosInstance.delete(`/client/deleteClient/${clientId}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      }
    });

    return { success: true, data: response.data };
  } catch (error) {
    let errorMessage = 'An error occurred while deleting client.';
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }

    return { success: false, error: errorMessage };
  }
};
