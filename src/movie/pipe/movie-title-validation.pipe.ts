import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class MovieTitleValidationPipe implements PipeTransform<string, string> {
  transform(value: string) {
    if (!value) {
      return value;
    }

    if (value.length <= 2) {
      throw new BadRequestException('3자 이상 입력해주세요.');
    }

    return value;
  }
}
