import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalSqlAuthGuard extends AuthGuard('local-sql') {}
