import { RouteConfig } from 'vue-router';
import { RouteInfo, Route } from './route-info.entity';

export class RouteFromViewLoader {
  private routes: any[] = [];
  private routesConfig: RouteConfig[] = [];

  constructor(private readonly loader: any) {
    this.loader.keys().forEach((fileName: string) => this.put(fileName));
    this.process();
  }

  public getRawRoutes() {
    return this.routes;
  }

  public getRoutes(): RouteConfig[] {
    return this.routesConfig.map((route: RouteConfig) => {
      return this.removeNameFromRoutesWithChildren(route);
    });
  }

  private put(fileName: string): void {
    const componentData: any = this.loader(fileName).default;
    const routeInfo: RouteInfo = componentData.getRouteInfo();
    this.routes.push(new Route(
      fileName,
      routeInfo.path,
      routeInfo.name,
      routeInfo.parent,
      routeInfo.meta,
    ));
  }

  private process(): void {
    let nestLevel: number = 0;
    while (
      this.routes.some((route: any) => route.nestLevel === nestLevel)
    ) {
      this.routes
        .filter((route: any) => route.nestLevel === nestLevel)
        .forEach((route: any) => {
          if (nestLevel > 0) {
            this.processWithParent(route);
            return;
          }

          this.processWithoutParent(route);
        });
      nestLevel += 1;
    }
  }

  private findChildrenRouteByName(route: RouteConfig, name: string): RouteConfig | undefined {
    if (!route.children) {
      return;
    }

    let routeConfig!: RouteConfig | undefined;
    route.children.forEach((childrenRoute: RouteConfig) => {
      if (routeConfig) {
        return;
      }

      if (childrenRoute.name === name) {
        routeConfig = childrenRoute;
        return;
      }

      if (childrenRoute.children) {
        routeConfig = this.findChildrenRouteByName(childrenRoute, name);
      }
    });

    return routeConfig;
  }

  private findRouteByName(name: string): RouteConfig {
    let routeConfig!: RouteConfig;
    this.routesConfig.forEach((route: RouteConfig) => {
      if (routeConfig) {
        return;
      }

      if (route.name === name) {
        routeConfig = route;
      }

      const tempRouteConfig: RouteConfig | undefined = this.findChildrenRouteByName(route, name);
      if (tempRouteConfig) {
        routeConfig = tempRouteConfig;
      }
    });

    return routeConfig;
  }

  private processWithParent(route: any): void {
    if (!route.parent) {
      return;
    }

    const parentRouteConfig: RouteConfig = this.findRouteByName(route.parent.name);

    if (!parentRouteConfig) {
      throw new Error(`No parent route found with name "${route.parent.name}"`);
    }

    if (!parentRouteConfig.children) {
      parentRouteConfig.children = [];
    }

    parentRouteConfig.children.push(route.routeConfig);
  }

  private processWithoutParent(route: any): void {
    if (!this.routesConfig.some((routeConfig: RouteConfig) => routeConfig.name === route.name)) {
      this.routesConfig.push(route.routeConfig);
    }
  }

  private removeNameFromRoutesWithChildren(route: RouteConfig) {
    if (route.children && route.children.length > 0) {
      delete route.name;
      route.children = route.children.map((childrenRoute: RouteConfig) => {
        return this.removeNameFromRoutesWithChildren(childrenRoute);
      });
    }

    return route;
  }
}
