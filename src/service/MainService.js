import axiosInstance from './axios'; 
export const postInvoiceData = async (data) => {
  try {
    const token = localStorage.getItem('accessToken');

    const response = await axiosInstance.post('/invoice/createInvoice', data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("response",response)
    return { success: true, data: response };
  } catch (error) {
    let errorMessage = 'An error occurred while Creating Invoice';
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }

    return { success: false, error: errorMessage };
  }
};
// export const postInvoiceData = async (data) => {
//   try {
//     const response = await axiosInstance.post('/invoice/createInvoice', data);
//     return { success: true, data: response };
//   } catch (error) {
//     console.error('Error in postInvoiceData:', error.message);
//     return { success: false, error: error.message || 'An error occurred while creating the invoice.' };
//   }
// };

export const updateInvoiceData = async (Id, updatedData) => {
  try {
    const response = await axiosInstance.put(`/invoice/updateInvoice/${Id}`, updatedData);
    return { success: true, data: response };
  } catch (error) {
    let errorMessage = 'An error occurred while updating the invoice.';
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }

    return { success: false, error: errorMessage };
  }
};
