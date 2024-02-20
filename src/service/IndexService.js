// services/InvoiceService.js

export const getAllInvoice = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch('http://localhost:3010/invoices/getAllInvoice', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,

        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch all invoices');
      }
  
      return response.json();
    } catch (error) {
      throw new Error('Error in getAllInvoice service: ' + error.message);
    }
  };