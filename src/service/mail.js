import axiosInstance from './axios';
export const sendInvoiceEmail = async (toEmail, subject, invoiceId) => {
  try {
    const response = await axiosInstance.post('/email/send', {
      to: toEmail,
      subject: subject,
      invoiceId: invoiceId,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message || 'Failed to send email' };
  }
};
export const getInvoiceEmail = async (toEmail, subject, invoiceId) => {
  try {
    const response = await axiosInstance.get('/invoice/getInvoice/${invoiceId}', {
      to: toEmail,
      subject: subject,
      invoiceId: invoiceId,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message || 'Failed to send email' };
  }
}
