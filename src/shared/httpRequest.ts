import axios, { InternalAxiosRequestConfig, Method } from 'axios';

const API_Timeout = 60000;

export type RequestHeaderProps = {
  headers?: { [key: string]: any };
};

export type RequestConfigProps = {
  timeout?: number;

  //type of project
  AppKey?: number | string;

  //token for request
  bearerToken?: string;

  abortSignal?: AbortSignal;

  tokenType?: string;
};

export type RequestParamsDataProps = {
  requestParams?: object;

  requestPostData?: object;
};

export type RequestProps = RequestConfigProps &
  RequestParamsDataProps &
  RequestHeaderProps & {
    url: string;

    method: Method;
  };

type AxiosRequestConfigWithMeta = InternalAxiosRequestConfig<any> & {
  meta?: { [key: string]: any };
};

export const httpRequest = ({
  url,
  method,
  requestParams,
  requestPostData,
  abortSignal,
  timeout = API_Timeout,
  AppKey = '',
  bearerToken,
  tokenType = 'Bearer',
  headers,
}: RequestProps) => {
  return httpRequestWithoutAuthorization({
    url,
    method,
    requestParams,
    requestPostData,
    timeout,
    abortSignal,

    headers: {
      'X-App-Key': AppKey,
      'Authorization': `${tokenType} ${bearerToken}`,
      ...headers,
    },
  });
};

export const httpRequestWithoutAuthorization = ({
  url,
  method,
  requestParams,
  requestPostData,
  abortSignal,
  timeout = API_Timeout,
  headers,
}: RequestProps) => {
  const instance = axios.create();
  instance.interceptors.request.use((config: AxiosRequestConfigWithMeta) => {
    config.meta = config.meta || {};
    config.meta.requestStartedAt = new Date().getTime();
    return config;
  });

  instance.interceptors.response.use(
    response => {
      const config: AxiosRequestConfigWithMeta = response.config;
      if (config.meta !== undefined) {
        config.meta = config.meta || {};
        config.meta.responseTime =
          new Date().getTime() - config?.meta.requestStartedAt;
        console.log(
          `Execution time for: ${config.url} - ${
            new Date().getTime() - config?.meta.requestStartedAt
          } ms`,
        );
      }
      return response;
    },
    response => {
      const config: AxiosRequestConfigWithMeta = response.config;
      if (config.meta !== undefined) {
        config.meta = config.meta || {};
        config.meta.responseTime =
          new Date().getTime() - config?.meta.requestStartedAt;
        console.warn(
          `Execution time for: ${config.url} - ${
            new Date().getTime() - config.meta.requestStartedAt
          } ms`,
        );
      }
      throw response;
    },
  );

  return instance.request({
    url: url,
    method: method,
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json;charset=utf-8',
      ...headers,
    },
    params: requestParams,
    data: requestPostData,
    timeout: timeout,
    signal: abortSignal,
  });
};
