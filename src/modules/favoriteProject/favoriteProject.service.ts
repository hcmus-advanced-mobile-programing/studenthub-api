import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpRequestContextService } from 'src/shared/http-request-context/http-request-context.service';
import { FavoriteProject } from 'src/modules/favoriteProject/favoriteProject.entity';
import { FavoriteProjectResDto } from 'src/modules/favoriteProject/dto/favorite-project-res';
import { DisableFlag } from 'src/common/common.enum';
import { DisableFavorityProjectDto } from 'src/modules/favoriteProject/dto/disable-favorite-project.dto';

@Injectable()
export class FavoriteProjectService {
  private readonly logger = new Logger(FavoriteProjectService.name);

  constructor(
    @InjectRepository(FavoriteProject)
    private favoriteProjectRepository: Repository<FavoriteProject>,
    private readonly httpContext: HttpRequestContextService
  ) { }

  async searchStudentId(studentId: string): Promise<any[]> {
    const projects = await this.favoriteProjectRepository.find({
      where: {
        studentId,
        disableFlag: DisableFlag.Enable
      },
      relations: ['project', 'project.proposals'],
    });

    const projectsWithProposalCount = projects.map(project => {
      const { proposals, ...projectInfo } = project.project;
      return {
        project: projectInfo,
        proposals: undefined, // Set proposals to undefined
        countProposals: proposals ? proposals.length : 0 // Count proposals if they exist, otherwise set to 0
      };
    });


    return projectsWithProposalCount;
  }

  async disable(studentId: string | number, params: DisableFavorityProjectDto): Promise<void> {
    await this.favoriteProjectRepository.update({ studentId, projectId: params.projectId }, { disableFlag: params.disableFlag })
  }
}
