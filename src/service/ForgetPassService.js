import axiosInstance from './axios';
export const ForgetUserApi = async (data) => {
  try {
    const token = localStorage.getItem("accessToken");

    const response = await axiosInstance.post(`/user/forgotpassword`, data, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    return { success: true, data: response };
  } catch (error) {
    let errorMessage = 'An error occurred while updating the password.';
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }
    return { success: false, error: errorMessage };
  }
};


