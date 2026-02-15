import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuallisEntity } from './entities/quallis.entity';
import { Injectable } from '@nestjs/common';
import { ErrorsService } from '../shared/shared-services/errors-service/errors-service.service';

@Injectable()
export class QuallisSqlService {
  constructor(
    @InjectRepository(QuallisEntity)
    private quallisRepository: Repository<QuallisEntity>,
    private readonly errorService: ErrorsService,
  ) {}

  async getStratumByISSNOrTitle(issn: string, title: string) {
    try {
      const realTitle = title.replace(/_/g, ' ').toUpperCase();

      const stratum = await this.quallisRepository
        .createQueryBuilder('quallis')
        .select('quallis.stratum')
        .where('quallis.issn = :issn', { issn })
        .orWhere('quallis.title = :title', { title: realTitle })
        .getOne();

      return stratum;
    } catch (error) {
      this.errorService.handleErrors(
        error,
        '#Erro ao buscar o estrato (SQL)',
        'getStratumByISSNOrTitle',
      );
    }
  }
}
