// invoiceService.js
import {BASE_URL} from "../utils/config";

// const BASE_URL = "http://localhost:3010/invoices/getInvoice";

export const
  getSingleInvoice= async (invoiceId) => {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await fetch(`${BASE_URL}/invoice/getInvoice/${invoiceId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,

          // Add any other headers as needed
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch invoice with ID ${invoiceId}`);
      }

      return response.json();
    } catch (error) {
      throw new Error(`Error in getSingleInvoice service: ${error.message}`);
    }
  };

  export const updateInvoiceStatus = async (invoiceId, updateData) => {
    try {
      // const token = localStorage.getItem("accessToken");

      // console.log("InvoiceId", invoiceId);
      // console.log("token>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.", token);

      // console.log("Access token Bhai is This For Now ><><>", accessToken);

      const response = await fetch(
        `${BASE_URL}/invoice/updatePaidInvoiceStatus/${invoiceId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        }
      );
      // console.log("invoiveId", invoiceId);

    const responseData = await response.json();
        
        if (!response.ok) {
          return { success: false, error: responseData.message || 'Failed to create invoice.' };
        }
        
        return { success: true, data: responseData };
      } catch (error) {
        return { success: false, error: error.message || 'A error occurred while creating the invoice.' };
      }
    };

export const updateUnpaidInvoiceStatus= async (invoiceId, updateData) => {
    try {
      // const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `${BASE_URL}/invoice/updateUnpaidInvoiceStatus/${invoiceId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      const responseData = await response.json();
        
        if (!response.ok) {
          return { success: false, error: responseData.message || 'Failed to create invoice.' };
        }
        
        return { success: true, data: responseData };
      } catch (error) {
        return { success: false, error: error.message || 'A error occurred while creating the invoice.' };
      }
    };
  export const deleteInvoice= async (invoiceId, updateData) => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `${BASE_URL}/invoice/deleteInvoice/${invoiceId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json(); // Parse error response
        console.error("Error response from server:", errorData);
        throw new Error(`Failed to deleteInvoice   for ID ${invoiceId}`);
      }

      return response.json();
    } catch (error) {
      console.error("Error in deleteInvoice service:", error);
      throw new Error(`Error in deleteInvoice service: ${error.message}`);
    }
  };


// 
