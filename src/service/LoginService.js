import axiosInstance from './axios';
export const loginUserApi = async (data) => {
  try {
    const response = await axiosInstance.post(`/user/loginUser`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return { success: true, data: response };
  } catch (error) {
    let errorMessage = 'An error occurred while login';
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }
    return { success: false, error: errorMessage };
  }
};

export const getUserDetailsApi = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    const response = await axiosInstance.get(`/user/me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response;
  } catch (error) {
    let errorMessage = 'An error occurred while getting the business profile.';
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }
    return { success: false, error: errorMessage };
  }
};
