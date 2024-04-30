// axiosInterceptor.js

import axios from 'axios';
import Swal from 'sweetalert2';

const axiosInstance = axios.create({
  // baseURL: 'http://3.1.100.174:3010/api',
  baseURL:  'http://localhost:3010/api',
  timeout: 10000, 
});

const handleResponse = (response) => {
  if (!response.status === 200) {
    throw new Error('Failed to fetch data.');
  }
  return response.data;
};

const handle401Error = () => {
  const userId = localStorage.getItem('UserId');
  if (userId) {
    Swal.fire({
      title: 'Session Expired',
      text: 'Your Session has Expired. Please Log In again',
      icon: 'error',
      confirmButtonText: 'OK',
      showConfirmButton: true,
    }).then(() => {
      localStorage.removeItem('userRole');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('UserId');
      localStorage.removeItem("selectedMenuItem");
      window.location.reload();
    });
  } else {
    localStorage.removeItem('userRole');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('UserId');
    window.location.reload();

  }
};
// axiosInstance.interceptors.response.use(
//     (response) => {
//       return response.data;
//     },
//     (error) => {
//       if (error.response) {
//         if (error.response.status === 401) {
//           handle401Error();
//           return Promise.reject({ message: 'Session expired' });
//         } else {
//           console.error('Error response from server:', error.response.data);
//           return Promise.reject(error.response.data);
//         }
//       } else if (error.request) {
//         console.error('No response from server:', error.request);
//         return Promise.reject({ message: 'No response from server' });
//       } else {
//         console.error('Request failed:', error.message);
//         return Promise.reject({ message: 'Request failed' });
//       }
//     }
//   );
axiosInstance.interceptors.response.use(
  (response) => handleResponse(response),
  (error) => {
    if (error.response.status === 401) {
      handle401Error();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
