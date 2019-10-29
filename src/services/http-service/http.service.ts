import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export class HttpService {
  private instance!: AxiosInstance;

  constructor(private readonly config: string | AxiosRequestConfig = '') {
    let axiosConfig!: AxiosRequestConfig;

    if (typeof config === 'string') {
      axiosConfig = { baseURL: config };
    } else {
      axiosConfig = config;
    }

    const instance: AxiosInstance = axios.create(axiosConfig);

    instance.interceptors.request.use(
      (requestConfig: AxiosRequestConfig): AxiosRequestConfig => {
        return requestConfig;
      },
    );

    this.instance = instance;
  }

  public get(url: string, config?: AxiosRequestConfig) {
    return this.instance.get(url, config);
  }

  public post(url: string, data: any, config?: AxiosRequestConfig) {
    return this.instance.post(url, data, config);
  }

  public put(url: string, data: any, config?: AxiosRequestConfig) {
    return this.instance.put(url, data, config);
  }

  public delete(url: string, config?: AxiosRequestConfig) {
    return this.instance.delete(url, config);
  }

  public make(httpMethod: string, httpArgs: any[]) {
    const self: any = this;
    return self[httpMethod].apply(this, httpArgs);
  }
}
