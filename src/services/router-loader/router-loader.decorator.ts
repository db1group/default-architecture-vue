import 'reflect-metadata';
import { RouteInfo } from './route-info.interface';

export function Route(routeConfig: RouteInfo) {
  return (target: any) => {
    if (routeConfig.parent) {
      if (!routeConfig.parent.getRouteInfo) {
        throw new Error('The parent component do not have an Route config');
      }

      routeConfig.parent = routeConfig.parent.getRouteInfo();
    }

    target.getRouteInfo = (): RouteInfo => {
      return routeConfig;
    };
  };
}
