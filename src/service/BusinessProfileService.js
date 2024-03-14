 import {BASE_URL} from "../utils/config";
export const PostBusinessProfilerIndiviualApi = async (data) => {
  try{
  const token = localStorage.getItem("accessToken");

    const response = await fetch(`${BASE_URL}/business/postbusinessProfile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`,

      },
      body: JSON.stringify(data),
    });
  
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to create client.');
    }

    return { success: true, data: responseData };
  } catch (error) {
    return { success: false, error: error.message || 'An error occurred while creating the client.' };
  }
};
  export const getBusinessProfileIndividualApi = async (data) => {
    const response = await fetch(`${BASE_URL}/business/getBusinessProfile/${individualId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to Post Business Profile Indiviual');
    }
  
    return response.json();
  };  
  export const GetBusinessProfileOrganizationApi = async (data) => {
    const response = await fetch(`${BASE_URL}/business/getBusinessProfile/${organizationId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to Post Business Profile Indiviual');
    }
  
    return response.json();
  };
  
  export const PostBusinessProfilerOrganizationApi = async (data) => {
    const response = await fetch(`${BASE_URL}/business/postbusinessProfile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    if (!response.ok) {
      throw new Error('Failed to Post Business Profile organization');
    }
  
    return response.json();
  }; 
  export const PatchBusinessProfilerIndiviualApi = async (individualId,data) => {
    try{
    const token = localStorage.getItem("accessToken");


    const response = await fetch(`${BASE_URL}/business/updatebusinessProfile/${individualId}`, {
      method: 'PUT',  // Change method to PUT
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`,

      },
      body: JSON.stringify(data),
    });
  
    
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to create client.');
    }

    return { success: true, data: responseData };
  } catch (error) {
    return { success: false, error: error.message || 'An error occurred while creating the client.' };
  }
};
  export const PatchBusinessProfilerOrganizationApi = async (organizationId,data) => {
    try{
    const token = localStorage.getItem("accessToken");

    const response = await fetch(`${BASE_URL}/business/updatebusinessProfile/${organizationId}`, {
      method: 'PUT',  // Change method to PUT
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`,

      },
      body: JSON.stringify(data),
    });
 
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to create client.');
    }

    return { success: true, data: responseData };
  } catch (error) {
    return { success: false, error: error.message || 'An error occurred while creating the client.' };
  }
};