import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

// Add request interceptor to include authentication token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const fetchBatteryStats = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/stats`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch battery stats: ${error.message}`);
  }
};

export const fetchAlerts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/alerts`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch alerts: ${error.message}`);
  }
};

export const fetchBatteries = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/batteries`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch batteries: ${error.message}`);
  }
};

export const getBattery = async (batteryId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/batteries/${batteryId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch battery: ${error.message}`);
  }
};

export const createBattery = async (batteryData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/batteries`, batteryData);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to create battery: ${error.message}`);
  }
};

export const updateBattery = async (batteryId, batteryData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/batteries/${batteryId}`, batteryData);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update battery: ${error.message}`);
  }
};

export const deleteBattery = async (batteryId) => {
  try {
    await axios.delete(`${API_BASE_URL}/batteries/${batteryId}`);
  } catch (error) {
    throw new Error(`Failed to delete battery: ${error.message}`);
  }
};

export const fetchBatteryAnalytics = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/analytics`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch analytics: ${error.message}`);
  }
};

export const updateBatteryStatus = async (batteryId, status) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/batteries/${batteryId}/status`, { status });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update battery status: ${error.message}`);
  }
};
