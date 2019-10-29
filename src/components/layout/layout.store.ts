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
