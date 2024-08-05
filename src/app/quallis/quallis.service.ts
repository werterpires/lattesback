import { InjectModel } from '@nestjs/mongoose';
import { Quallis } from './schemas/quallis.schema';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { ErrorsService } from '../shared/shared-services/errors-service/errors-service.service';

@Injectable()
export class QuallisService {
  constructor(
    @InjectModel(Quallis.name) private quallisModel: Model<Quallis>,
    private readonly errorService: ErrorsService,
  ) {}
  getStratumByISSNOrTitle(issn: string, title: string) {
    try {
      const realTitle = title.replace(/_/g, ' ').toUpperCase();

      const stratum = this.quallisModel.findOne(
        {
          $or: [{ issn }, { title: realTitle }],
        },
        { _id: 0, stratum: 1 },
      );
      return stratum;
    } catch (error) {
      this.errorService.handleErrors(
        error,
        '#Erro ao buscar o estrato',
        'getStratumByISSNOrTitle',
      );
    }
  }
}
