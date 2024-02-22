// invoiceService.js

const BASE_URL = "http://localhost:3010/invoices/GetInvoice";

const invoiceService = {
  getSingleInvoice: async (invoiceId) => {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await fetch(`${BASE_URL}/${invoiceId}`, {
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
  },

  updateInvoiceStatus: async (invoiceId, updateData) => {
    try {
      // const token = localStorage.getItem("accessToken");

      // console.log("InvoiceId", invoiceId);
      // console.log("token>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.", token);

      // console.log("Access token Bhai is This For Now ><><>", accessToken);

      const response = await fetch(
        `http://localhost:3010/invoices/updatePaidInvoiceStatus/${invoiceId}`,
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

      if (!response.ok) {
        const errorData = await response.json(); // Parse error response
        console.error("Error response from server:", errorData);
        throw new Error(`Failed to update invoice status for ID ${invoiceId}`);
      }

      return response.json();
    } catch (error) {
      console.error("Error in updateInvoiceStatus service:", error);
      throw new Error(`Error in updateInvoiceStatus service: ${error.message}`);
    }
  },
  updateUnpaidInvoiceStatus: async (invoiceId, updateData) => {
    try {
      // const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `http://localhost:3010/invoices/updateUnpaidInvoiceStatus/${invoiceId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json(); // Parse error response
        console.error("Error response from server:", errorData);
        throw new Error(
          `Failed to updateUnpaidInvoiceStatus status for ID ${invoiceId}`
        );
      }

      return response.json();
    } catch (error) {
      console.error("Error in updateUnpaidInvoiceStatus service:", error);
      throw new Error(
        `Error in updateUnpaidInvoiceStatus service: ${error.message}`
      );
    }
  },
  deleteInvoice: async (invoiceId, updateData) => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `http://localhost:3010/invoices/deleteInvoice/${invoiceId}`,
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
  },
};

export default invoiceService;
