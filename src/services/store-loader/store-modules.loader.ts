import camelCase from 'camelcase';

export class StoreModulesLoader {
  private storeList: any = {};

  constructor(private readonly loader: any) {
    this.loader.keys().forEach((fileName: string) => this.put(fileName));
  }

  private put(fileName: string): void {
    const className: string = this.getClassNameByFileName(fileName);
    const storeModule: any = this.loader(fileName).default;

    if (storeModule) {
      this.storeList[className] = storeModule;
    }
  }

  private getClassNameByFileName(fileName: string): string {
    let className: string = fileName.split('/').pop() || '';
    className = className.split('.').shift() || '';

    return camelCase(className, { pascalCase: true });
  }

  get stores(): any {
    return this.storeList;
  }
}
