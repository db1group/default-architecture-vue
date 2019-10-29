import { Service, Get, Response } from '@/services/http-service/service.decorator';
import { Repository } from './projects.entity';

@Service('https://api.github.com/')
export default class ProjectsService {
  @Get('/users/db1group/repos')
  public static async getReposFromUser(
    @Response(Repository) response?: Promise<Repository[]>,
  ): Promise<any> {
    return response;
  }
}
