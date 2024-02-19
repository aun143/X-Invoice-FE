export const PostBusinessProfilerIndiviualApi = async (data) => {
  const token = localStorage.getItem("accessToken");

    const response = await fetch('http://localhost:3010/business/postbusinessProfile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`,

      },
      body: JSON.stringify(data),
    });
  
    if (!response.ok) {
      throw new Error('Failed to Post Business Profile Indiviual');
    }
  
    return response.json();
  };
  export const getBusinessProfileIndividualApi = async (data) => {
    const response = await fetch(`http://localhost:3010/business/singleprofile/${individualId}`, {
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
    const response = await fetch(`http://localhost:3010/business/singleprofile/${organizationId}`, {
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
    const response = await fetch('http://localhost:3010/business/postbusinessProfile', {
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
    const token = localStorage.getItem("accessToken");


    const response = await fetch(`http://localhost:3010/business/updatebusinessProfile/${individualId}`, {
      method: 'PUT',  // Change method to PUT
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`,

      },
      body: JSON.stringify(data),
    });
  
    if (!response.ok) {
      throw new Error('Failed to Put Business Profile Indiviual');
    }
  
    return response.json();
  };
  
  export const PatchBusinessProfilerOrganizationApi = async (organizationId,data) => {
    const token = localStorage.getItem("accessToken");

    const response = await fetch(`http://localhost:3010/business/updatebusinessProfile/${organizationId}`, {
      method: 'PUT',  // Change method to PUT
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`,

      },
      body: JSON.stringify(data),
    });
  
    if (!response.ok) {
      throw new Error('Failed to Put Business Profile organization');
    }
  
    return response.json();
  };
  