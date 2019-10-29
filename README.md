# DB1 Group - Vuejs Boilerplate

This is an open source MIT project tha has been made to facilitate the development of vuejs applications.

Project stacks:

* [Vuejs 2.6.10](https://vuejs.org/)
* [Vuetify 2.1.0](https://vuetifyjs.com)
* [Typescript 3.6.4](https://www.typescriptlang.org/)
* [Pug 2.0.4](https://pugjs.org)
* [Sass node-sass@4.12.0](https://sass-lang.com/)
* [Jest 23.6.0](https://jestjs.io/)
* [Cypress 3.5.0](https://www.cypress.io/)

## Features and examples

### Class based component
``` typescript
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class ExampleComponent extends Vue {}
```

You can see all the documentation about that in the github project of [vue-property-decorator](https://github.com/kaorun343/vue-property-decorator)

### Creating a route in the component
``` typescript
import { Component, Vue } from 'vue-property-decorator';
import { Route } from '@/services/router-loader/router-loader.decorator';
import ParentComponentIfExists from './path-to/parent-component.vue';

@Route({
  path: '/example-path',
  name: 'example-route',
  parent: ParentComponentIfExists,
})
@Component
export default class ExampleComponent extends Vue {}
```

### Creating an entity
``` typescript
import { Entity, Body, Type } from '@/services/entity/entity.decorator';

@Entity
export class SuperPower {
  @Body()
  public title!: string;

  @Body()
  public description!: string;
}

@Entity
export class Hero {
  @Body()
  public name!: string;

  @Type(SuperPower)
  public superPowers!: SuperPower[];
}
```

### Creating a service
``` typescript
@Service()
export default class HeroService {
  @Get('/heroes')
  public static async getAllHeroes(
    @QueryString() page: number = 1,
    @Response(HeroPagination) response?: Promise<HeroPagination>,
  ) {
    return response;
  }

  @Get('/heroes/:id')
  public static async getHeroById(
    @Param('id') id: string,
    @Response(Hero) response?: Promise<Hero>,
  ) {
    return response;
  }
}
```

### Vuex stores
``` typescript
import { Module, Action, Mutation, VuexModule } from 'vuex-module-decorators';

@Module
export default class LayoutStore extends VuexModule {
  public isDark: boolean = false;

  @Mutation
  public setIsDark(isDark: boolean) {
    this.isDark = isDark;
  }

  @Action({ commit: 'setIsDark' })
  public toggleIsDark(): boolean {
    return !this.isDark;
  }
}
```

You can see all the documentation about that in the github project of [vuex-module-decorators](https://github.com/championswimmer/vuex-module-decorators)

### Autoloaders

This project uses the require.context feature of webpack to load same things like routes and store. The autoloader rules depends of the file name to works, because of this, you need to pay attention in the sufix of file names.

Examples of file names:
* **Service:** hero.service.ts
* **Entity:** hero.entity.ts
* **Store:** hero.store.ts
* **Component:** for components are 2 rules:
  * **Components that contains routes:** hero.view.vue
  * **Other components:** hero.component.vue

## Project setup

You can use **npm** or **yarn**.

``` bash
yarn install
```

### Compiles and hot-reloads for development
``` bash
yarn run serve
```

### Compiles and minifies for production
``` bash
yarn run build
```

### Run your tests
``` bash
yarn run test
```

### Lints and fixes files
``` bash
yarn run lint
```

### Run your end-to-end tests
``` bash
yarn run test:e2e
```

### Run your unit tests
``` bash
yarn run test:unit
```
