import axios, {
  AxiosInstance,
  AxiosError,
  AxiosResponse,
  AxiosRequestConfig,
} from 'axios';

const instance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // baseURL: 'http://localhost:2456',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const handleError = (error: AxiosError): Promise<never> => {
  if (error.response) {
    console.error('Error data:', error.response.data);
    console.error('Error status:', error.response.status);
  } else if (error.request) {
    console.error('No response received:', error.request);
  } else {
    console.error('Error message:', error.message);
  }

  return Promise.reject(error);
};

instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => handleError(error),
);

export const api = {
  get: <T = any>(
    url: string,
    config: AxiosRequestConfig = {},
  ): Promise<AxiosResponse<T>> => instance.get<T>(url, config),
  post: <T = any>(
    url: string,
    data?: any,
    config: AxiosRequestConfig = {},
  ): Promise<AxiosResponse<T>> => instance.post<T>(url, data, config),
  put: <T = any>(
    url: string,
    data?: any,
    config: AxiosRequestConfig = {},
  ): Promise<AxiosResponse<T>> => instance.put<T>(url, data, config),
  delete: <T = any>(
    url: string,
    config: AxiosRequestConfig = {},
  ): Promise<AxiosResponse<T>> => instance.delete<T>(url, config),
  patch: <T = any>(
    url: string,
    data?: any,
    config: AxiosRequestConfig = {},
  ): Promise<AxiosResponse<T>> => instance.patch<T>(url, data, config),
};

export default api;
