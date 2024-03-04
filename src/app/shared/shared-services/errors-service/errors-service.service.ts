import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class ErrorsService {
  handleErrors(error: any, message: string, func: string): any {
    // console.error('erro para debug:', error);
    if (error.message.startsWith('#')) {
      return error;
    } else {
      console.error(`new error in  ${func}:`);
      console.error(error);
      return new InternalServerErrorException(
        '#Impossível de realizar a operação',
      );
    }
  }
}
