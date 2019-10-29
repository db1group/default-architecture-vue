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
