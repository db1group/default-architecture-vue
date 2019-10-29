import { Vue } from 'vue-property-decorator';
import { RouteConfig as RouteConfigBase } from 'vue-router';

export interface RouteBreadcrumbs {
  type?: string;
  title: string;
  route: string;
}

export interface RouteMeta {
  breadcrumbs?: RouteBreadcrumbs[];
  [key: string]: any;
}

export interface RouteInfo {
  readonly path: string;
  readonly name: string;
  meta?: RouteMeta;
  parent?: RouteInfo | Vue | any;
  getRouteInfo?: () => RouteInfo;
}

export interface RouteConfig extends RouteConfigBase {
  readonly fileName: string;
}

export class Route {
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
