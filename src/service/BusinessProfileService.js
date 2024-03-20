import axiosInstance from './axios'; 
export const PostBusinessProfilerIndiviualApi = async (data) => {
  try {
    const token = localStorage.getItem('accessToken');

    const response = await axiosInstance.post(`/business/postbusinessProfile`, data, {
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`,
      },
    });

    return { success: true, data: response };
  } catch (error) {
    let errorMessage = 'An error occurred while creating the business profile';
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }
    return { success: false, error: errorMessage };
  }
};

export const PatchBusinessProfilerIndiviualApi = async (individualId, data) => {
  try {
    const token = localStorage.getItem('accessToken');

    const response = await axiosInstance.put(`/business/updatebusinessProfile/${individualId}`, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    return { success: true, data: response.data };
  } catch (error) {
    // console.log("error", error);

    let errorMessage = 'An error occurred while updating the individual business profile.';
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }

    return { success: false, error: errorMessage };
  }
};

export const PatchBusinessProfilerOrganizationApi = async (organizationId, data) => {
  try {
    const token = localStorage.getItem('accessToken');

    const response = await axiosInstance.put(`/business/updatebusinessProfile/${organizationId}`, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    return { success: true, data: response.data };
  } catch (error) {
    // console.log("error", error);

    let errorMessage = 'An error occurred while updating the organization business profile.';
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }

    return { success: false, error: errorMessage };
  }
};
