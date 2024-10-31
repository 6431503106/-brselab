import axios from "axios";

// Create an instance of axios
export const BASE_URL = "http://localhost:5000";

export const api = axios.create({
  baseURL: BASE_URL + "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptor for handling token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      originalRequest &&
      !originalRequest.isRetry
    ) {
      originalRequest.isRetry = true;
      try {
        await axios.get(`${BASE_URL}/api/auth/refresh-tokens`, {
          withCredentials: true,
        });
        return api.request(originalRequest);
      } catch (err) {
        // Handle refresh token error
      }
    } else {
      throw error;
    }
  }
);

// Messages API requests
export const getMessages = () => api.get('/general/contact-us');
export const handleMessages = (data) => api.post('/general/handle-messages', data); 

//Contact Us API call
export const contactUs = (data) => api.post("/general/contact-us", data);