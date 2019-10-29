export default function EntityFactory(entity: any, data: any): any {
  if (!data) {
    return;
  }

  if (Array.isArray(data)) {
    return data.map((item: any) => EntityFactory(entity, item));
  }

  return new entity(data);
}
