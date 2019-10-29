import { RouteInfo, RouteMeta, RouteConfig } from './route-info.interface';

export class RouteInfoIMPL implements RouteInfo {
  constructor(
    readonly fileName: string,
    readonly path: string,
    readonly name: string,
    readonly parent?: RouteInfo,
    readonly meta?: RouteMeta,
  ) {}

  get component(): () => any {
    return () => import(`../../${this.fileName.split('./').pop()}`);
  }

  get filePath() {
    return this.fileName;
  }

  get routeConfig(): RouteConfig {
    return {
      path: this.path,
      name: this.name,
      meta: this.meta,
      component: this.component,
      fileName: this.fileName,
    };
  }

  get nestLevel() {
    let count: number = 0;
    let parentRoute: RouteInfo = this;

    while (typeof parentRoute.parent === 'object') {
      count += 1;
      if (parentRoute.parent) {
        parentRoute = parentRoute.parent;
      }
    }

    return count;
  }
}
