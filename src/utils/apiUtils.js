import axios from "axios";

export const apiRequest = async (url, method = "GET", data = null, headers = {}) => {
  try {
 
    const normalizedUrl = url.startsWith("/") ? url : `${url}`;
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const fullUrl = `${normalizedUrl}`;
    console.log(`apiRequest: Constructed URL: ${fullUrl}`);

    const config = {
      method,
      url: fullUrl,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      ...(data ? { data } : {}),
      withCredentials: true, // Send cookies (e.g., token)
    };

    console.log(`apiRequest: Sending ${method} request to ${fullUrl}`, {
      headers: config.headers,
      data,
    });

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error("apiRequest Error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers,
    });
    throw error;
  }
};