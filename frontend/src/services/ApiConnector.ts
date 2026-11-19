import axios, { AxiosRequestConfig, Method, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { refreshToken as refreshTokenEndpoint } from './Api';

export const axiosInstance = axios.create({
  withCredentials: true,
  headers: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
  },
});

interface QueueItem {
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}

// Concurrency queue to handle multiple API requests failing at the same time
let isRefreshing = false;
let failedQueue: QueueItem[] = [];

// Request Interceptor: attach token header fallback from localStorage if present
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    try {
      const rawToken = localStorage.getItem('token');
      if (rawToken) {
        const token = JSON.parse(rawToken);
        if (token && typeof token === 'string' && token !== 'cookie') {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (e) {
      // Ignore storage/parse error
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const processQueue = (error: any, token: string | null = null) => {
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
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response.status;
    const url = originalRequest.url || '';

    // Auth endpoints should not attempt to refresh
    const isAuthEndpoint =
      url.includes('/auth/login') ||
      url.includes('/auth/signup') ||
      url.includes('/auth/sendotp') ||
      url.includes('/auth/refresh-token') ||
      url.includes('/auth/logout');

    if (status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
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

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null);

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

export const ApiConnector = <T = any>(
  method: Method | string,
  url: string,
  bodyData?: any,
  headers?: any,
  params?: any
): Promise<AxiosResponse<T>> => {
  return axiosInstance({
    method: method as Method,
    url: `${url}`,
    data: bodyData ? bodyData : null,
    headers: headers ? headers : null,
    params: params ? params : null,
  });
};
