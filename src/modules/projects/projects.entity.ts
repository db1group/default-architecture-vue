import { Entity, Body, Type } from '@/services/entity/entity.decorator';

@Entity
export class User {
  @Body('login')
  public name!: string;

  @Body('avatar_url')
  public avatar!: string;
}

@Entity
export class Repository {
  @Body()
  public name!: string;

  @Body('html_url')
  public url!: string;

  @Type(User)
  public owner!: User;
}
