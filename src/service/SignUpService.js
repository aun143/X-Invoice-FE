import {BASE_URL} from "../utils/config";
export const signUpUserApi = async (data) => {
  const response = await fetch(`${BASE_URL}/user/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to SignUp');
  }

  return response.json();
};
export const getSignUpUser = async (data) => {
  const response = await fetch(`${BASE_URL}/user/getLoginUser`, {
    method: 'Get',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to SignUp');
  }

  return response.json();
};
export const updateSignUpData = async (data) => {
  const response = await fetch(`${BASE_URL}/user/subscription`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to SignUp');
  }

  return response.json();
};
