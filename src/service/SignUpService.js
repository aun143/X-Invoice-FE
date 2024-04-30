import { data } from 'autoprefixer';
import axiosInstance from './axios'; 
export const signUpUserApi = async (data) => {
  try {
    const response = await axiosInstance.post('/user/create', data);

    // Axios handles response status internally, so no need to check for response.ok
    return { success: true, data: response };
  } catch (error) {
    let errorMessage = 'An error occurred while signup.';
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }

    return { success: false, error: errorMessage };
  }
};

// export const getSignUpUser = async () => {
//   try {
//     const response = await axiosInstance.get('/user/getLoginUser');

//     // Axios handles response status internally, so no need to check for response.ok
//     return response.data;
//   } catch (error) {
//     // Axios interceptor will handle error responses
//     throw new Error('Failed to get SignUp user');
//   }
// };

export const selectPlan = async (data) => {
  try {
    const response = await axiosInstance.put('/plan/choosePlan', data);

    // Axios handles response status internally, so no need to check for response.ok
    return response;
  } catch (error) {
    let errorMessage = 'An error occurred while updating signup data.';
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }

    // throw new Error('Failed to update SignUp data');
    return { success: false, error: errorMessage };
  }
};


// export const palnPayment = async (data)=>{
//   try {
//     const response = await axiosInstance.post('/plan/payment',data);
//     return response;
//   } catch (error) {
//     let errorMessage = 'An error occurred while updating signup data.';
//     if (error.response && error.response.data && error.response.data.message) {
//       errorMessage = error.response.data.message;
//     } 
//     return { success: false, error: errorMessage };
    
//   }
// }



export const planPayment = async (data) => {
  try {
    const response = await axiosInstance.post('/plan/payment', data);
    return response.data; // Assuming your response structure includes a `data` field
  } catch (error) {
    let errorMessage = 'An error occurred while processing payment.';
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    } 
    return { success: false, error: errorMessage };
  }
};