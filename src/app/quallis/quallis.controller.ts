import { Controller, Get, Param } from '@nestjs/common';
import { QuallisService } from './quallis.service';

@Controller('quallis')
export class QuallisController {
  constructor(private readonly quallisService: QuallisService) {}

  @Get(':issn/:title')
  getStratumByISSNOrTitle(
    @Param('issn') issn: string,
    @Param('title') title: string,
  ) {
    return this.quallisService.getStratumByISSNOrTitle(issn, title);
  }
}
