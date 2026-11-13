import axios from 'axios';
import { refreshToken as refreshTokenEndpoint } from './Api';

export const axiosInstance = axios.create({
  withCredentials: true,
});

// Concurrency queue to handle multiple API requests failing at the same time
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor: silently refreshes expired access token on 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response.status;
    const url = originalRequest.url || '';

    // Auth endpoints should not attempt to refresh (e.g. invalid login password, signup, or refresh itself)
    const isAuthEndpoint =
      url.includes('/auth/login') ||
      url.includes('/auth/signup') ||
      url.includes('/auth/sendotp') ||
      url.includes('/auth/refresh-token') ||
      url.includes('/auth/logout');

    if (status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        // If a refresh is already in progress, enqueue this request until refresh finishes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call backend refresh endpoint with credentials (cookie)
        const refreshResponse = await axios.post(
          refreshTokenEndpoint.REFRESH_TOKEN_API,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data?.token;
        if (newAccessToken && typeof window !== 'undefined') {
          try {
            localStorage.setItem('token', JSON.stringify(newAccessToken));
          } catch (e) {
            // Ignore storage write errors
          }
        }

        isRefreshing = false;
        processQueue(null, newAccessToken);

        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null);

        // Session expired: clean up client auth state
        if (typeof window !== 'undefined') {
          try {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          } catch (e) {
            // Ignore storage errors
          }
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const ApiConnector = (method, url, bodyData, headers, params) => {
  return axiosInstance({
    method: `${method}`,
    url: `${url}`,
    data: bodyData ? bodyData : null,
    headers: headers ? headers : null,
    params: params ? params : null,
  });
};
