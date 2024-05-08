import axiosInstance from './axios'; 
// const BASE_URL = "http://localhost:3010/invoices/getInvoice";
export const getSingleInvoice = async (invoiceId) => {
  try {
    // const token = localStorage.getItem('accessToken');

    const response = await axiosInstance.get(`/invoice/getInvoice/${invoiceId}`, {
      headers: {
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${token}`,
      },
    });
    // console.log("response",response)
    return { success: true, data: response };
  } catch (error) {
    let errorMessage = 'An error occurred while getting single Invoice.';
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }

    return { success: false, error: errorMessage };
  }
};
  export const updateInvoiceStatus = async (invoiceId, data) => {

    try {
      const token = localStorage.getItem('accessToken');
  
      const response = await axiosInstance.put(`/invoice/updatePaidInvoiceStatus/${invoiceId}`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      return { success: true, data: response };
    } catch (error) {
      // console.log("error", error);
  
      let errorMessage = 'An error occurred while updating the Invoice Payment Status.';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
  
      return { success: false, error: errorMessage };
    }
  };
  export const updateUnpaidInvoiceStatus = async (invoiceId, data) => {

    try {
      const token = localStorage.getItem('accessToken');
  
      const response = await axiosInstance.put(`/invoice/updatePaidInvoiceStatus/${invoiceId}`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      return { success: true, data: response };
    } catch (error) {
      // console.log("error", error);
  
      let errorMessage = 'An error occurred while updating the Invoice Payment Status.';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
  
      return { success: false, error: errorMessage };
    }
  };  
 
  export const deleteInvoice = async  (invoiceId)  => {
    try {
      const token = localStorage.getItem("accessToken");
  
      const response = await axiosInstance.delete(`/invoice/deleteInvoice/${invoiceId}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }
      });
  
      return { success: true, data: response.data };
    } catch (error) {
      let errorMessage = 'An error occurred while deleting the invoice.';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
  
      return { success: false, error: errorMessage };
    }
  };
 





// 
