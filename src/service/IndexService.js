// services/InvoiceService.js
import {BASE_URL} from "../utils/config";

export const getAllInvoice = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(`${BASE_URL}/invoice/getAllInvoice`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,

        },
      });
  
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed get invoices.');
      }
  
      return { success: true, data: responseData };
    } catch (error) {
      return { success: false, error: error.message || 'An error occurred while getting the invoices.' };
    }
  };
  