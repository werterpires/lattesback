import { Controller, Get, Param } from '@nestjs/common';
// import { QuallisService } from './quallis.service';
import { QuallisSqlService } from './quallis-sql.service';

@Controller('quallis')
export class QuallisController {
  constructor(
    // private readonly quallisService: QuallisService,
    private readonly quallisSqlService: QuallisSqlService,
  ) {}

  // ========== ENDPOINTS MONGODB (comentados - migrado para SQL Server) ==========

  // @Get(':issn/:title')
  // getStratumByISSNOrTitle(
  //   @Param('issn') issn: string,
  //   @Param('title') title: string,
  // ) {
  //   return this.quallisService.getStratumByISSNOrTitle(issn, title);
  // }

  // ========== ENDPOINTS SQL SERVER (ativos) ==========

  @Get(':issn/:title')
  getStratumByISSNOrTitleSql(
    @Param('issn') issn: string,
    @Param('title') title: string,
  ) {
    return this.quallisSqlService.getStratumByISSNOrTitle(issn, title);
  }
}
