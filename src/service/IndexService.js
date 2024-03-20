import axiosInstance from './axios'; 
export const getAllInvoice = async () => {
  try {
    const token = localStorage.getItem('accessToken');

    const response = await axiosInstance.get('/invoice/getAllInvoice', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log("response",response)
    return { success: true, data: response };
  } catch (error) {
    let errorMessage = 'An error occurred while getting all invoice.';
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }

    return { success: false, error: errorMessage };
  }
};
