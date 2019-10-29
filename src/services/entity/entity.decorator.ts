import qs from 'qs';
import 'reflect-metadata';
import { AxiosResponse } from 'axios';
import EntityFactory from './entity.factory';
import { EntityProperty } from './entity-property.interface';

function entityTypeFactory(target: any, propertyKey: string | symbol, type: string, name?: string) {
  const data: EntityProperty[] = Reflect.getMetadata('entity', target, 'properties') || [];
  data.push({
    type,
    propertyKey,
    name: name || propertyKey,
  });
  Reflect.defineMetadata('entity', data, target, 'properties');
}

export function Type(entity: any) {
  return (target: any, propertyKey: string | symbol) => {
    entityTypeFactory(target, propertyKey, 'type', entity);
  };
}

export function Body(name?: string) {
  return (target: any, propertyKey: string | symbol) => {
    entityTypeFactory(target, propertyKey, 'body', name);
  };
}

export function Param(name?: string) {
  return (target: any, propertyKey: string | symbol) => {
    entityTypeFactory(target, propertyKey, 'param', name);
  };
}

function scrapData(object: any, metadata: EntityProperty[], body: any): any {
  const data: any = {};
  const queryString = qs.parse(location.search.replace('?', ''));

  metadata.forEach((property: EntityProperty) => {
    let value!: any;

    if (property.type === 'body') {
      value = body.data && property.name !== 'data'
          ? body.data[property.name]
          : body[property.name];
    } else if (property.type === 'param') {
      value = queryString[property.name];
    } else if (property.type === 'type') {
      const bodyData = property.propertyKey === 'data' ? body : body.data || body;
      value = EntityFactory(property.name, bodyData[property.propertyKey]);
    }
    if (object[property.name] && !value) {
      return;
    }

    data[property.propertyKey] = value;
  });

  return data;
}

export function Entity<T extends new (...args: any[]) => object>(target: T) {
  return class EntityData extends target {
    constructor(...args: any[]) {
      super(args);
      if (!args[0]) {
        args[0] = {};
      }
      this.fill(args[0]);
    }

    public fill(data: AxiosResponse | any) {
      const entityMetadata: EntityProperty[] = Reflect.getMetadata('entity', this, 'properties');
      Object.assign(this, scrapData(this, entityMetadata, data));
    }
  };
}
