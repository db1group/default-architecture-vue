import qs from 'qs';
import 'reflect-metadata';
import pathToRegexp, { PathFunction } from 'path-to-regexp';
import { HttpService } from './http.service';
import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from 'axios';
import EntityFactory from '../entity/entity.factory';

export function Service(config?: string | AxiosRequestConfig | undefined) {
  return <T extends new (...args: any[]) => object>(target: T) => {
    return class HttpClient extends target {
      private readonly http!: HttpService;
      private defaultUrl: string | undefined;

      constructor(...args: any[]) {
        super(args);
        const windowInstance: any = window;
        this.defaultUrl = windowInstance._env_.VUE_APP_API_BASE_URL;
        this.http = new HttpService(config || this.defaultUrl);
      }
    };
  };
}

enum RequestParameterType {
  QUERY_STRING = 'qs',
  PARAM = 'params',
  BODY = 'body',
  HEADER = 'headers',
  RESPONSE = 'response',
}

export function QueryString() {
  return (target: any, key: string, parameterIndex: number) => {
    defineArgumentType(
      target,
      key,
      parameterIndex,
      RequestParameterType.QUERY_STRING,
      'qs',
    );
  };
}

export function Param(name?: string) {
  return (target: any, key: string, parameterIndex: number) => {
    defineArgumentType(
      target,
      key,
      parameterIndex,
      RequestParameterType.PARAM,
      name,
    );
  };
}

export function Body(name?: string) {
  return (target: any, key: string, parameterIndex: number) => {
    defineArgumentType(
      target,
      key,
      parameterIndex,
      RequestParameterType.BODY,
      name,
    );
  };
}

export function Header(name?: string) {
  return (target: any, key: string, parameterIndex: number) => {
    defineArgumentType(
      target,
      key,
      parameterIndex,
      RequestParameterType.HEADER,
      name,
    );
  };
}

export function Response(type?: any) {
  return (target: any, key: string, parameterIndex: number) => {
    defineArgumentType(
      target,
      key,
      parameterIndex,
      RequestParameterType.RESPONSE,
    );
    Reflect.defineMetadata(
      `${key}-response`,
      type,
      target,
      `param-${parameterIndex}`,
    );
  };
}

function defineArgumentType(
  target: any,
  key: string,
  parameterIndex: number,
  type: RequestParameterType,
  name: string = '',
) {
  Reflect.defineMetadata(
    `${key}-arguments-name`,
    name || 'unamed',
    target,
    `param-${parameterIndex}`,
  );
  Reflect.defineMetadata(
    `${key}-arguments`,
    type,
    target,
    `param-${parameterIndex}`,
  );
  const argumentsNumber: number =
    Reflect.getMetadata(`${key}-arguments-number`, target) || 0;
  Reflect.defineMetadata(
    `${key}-arguments-number`,
    argumentsNumber + 1,
    target,
  );
}

export function Request(type: string, url: string) {
  return (target: any, propertyKey: string, descriptor: any) => {
    const urlParams: any[] = [];
    pathToRegexp(url, urlParams);
    return requestMethodDecorator(
      type,
      url,
      target,
      propertyKey,
      descriptor,
      urlParams,
    );
  };
}

export function Get(url: string) {
  return Request('get', url);
}

export function Post(url: string) {
  return Request('post', url);
}

export function Put(url: string) {
  return Request('put', url);
}

export function Patch(url: string) {
  return Request('patch', url);
}

export function Delete(url: string) {
  return Request('delete', url);
}

function requestMethodDecorator(
  httpMethod: string,
  url: string,
  target: any,
  propertyKey: string,
  descriptor: any,
  urlParams: any,
) {
  const originalMethod: any = descriptor.value;

  descriptor.value = function(...args: any[]) {
    let queryString: string = '';
    let responseType!: any;
    let responseIndex!: number;
    const options: any = {
      params: {},
      body: {},
      headers: {},
    };

    const argumentsNumber: number =
        Reflect.getMetadata(`${propertyKey}-arguments-number`, target) || 0;
    if (argumentsNumber) {
      for (let indexOf: number = 0; indexOf < argumentsNumber; indexOf += 1) {
        const name: RequestParameterType = Reflect.getMetadata(
          `${propertyKey}-arguments-name`,
          target,
          `param-${indexOf}`,
        );
        const type: RequestParameterType = Reflect.getMetadata(
          `${propertyKey}-arguments`,
          target,
          `param-${indexOf}`,
        );

        if (type === RequestParameterType.RESPONSE) {
          responseType = Reflect.getMetadata(
            `${propertyKey}-response`,
            target,
            `param-${indexOf}`,
          );
          responseIndex = indexOf;
          continue;
        }

        const arg = args[indexOf];

        if (!arg) {
          continue;
        }

        if (type === RequestParameterType.QUERY_STRING) {
          queryString = qs.stringify(arg);
          continue;
        }

        if (type === RequestParameterType.BODY) {
          Object.assign(options[type], arg);
          continue;
        }

        if (
          type === RequestParameterType.PARAM &&
          urlParams.some((param: any) => param.name === name)
        ) {
          urlParams.find((param: any) => param.name === name).value = arg;
          continue;
        }

        options[type][name] = arg;
      }
    }

    let endpoint = url;
    if (urlParams.length > 0) {
      const urlParamsOverride: any = {};
      urlParams.forEach((param: any) => {
        urlParamsOverride[param.name] = param.value;
      });
      const toPath: any = pathToRegexp.compile(url);
      endpoint = toPath(urlParamsOverride);
    }

    let urlString: string = endpoint;
    if (queryString) {
      urlString = `${endpoint}?${queryString}`;
    }
    const httpArgs: any[] = [urlString];

    if (
      httpMethod.toLowerCase() === 'post' ||
      httpMethod.toLowerCase() === 'put'
    ) {
      httpArgs.push(options.body);
    }

    httpArgs.push(options);
    const httpinstance = this;
    const http = this.http ? this.http : new httpinstance().http;
    const request: AxiosPromise = http.make(httpMethod, httpArgs);

    if (responseIndex !== undefined) {
      args[responseIndex] = request.then((response: AxiosResponse) => {
        if (responseType) {
          return EntityFactory(responseType, response.data);
        }
        return response;
      });
    }

    return originalMethod.apply(this, args);
  };

  return descriptor;
}
