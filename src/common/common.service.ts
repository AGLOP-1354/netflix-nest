import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { CursorPaginationDto } from './dto/cursor-pagination.dto';
import { PagePaginationDto } from './dto/page-pagination.dto';

@Injectable()
export class CommonService {
  constructor() {}

  applyPagePaginationParmasToQb<T>(
    qb: SelectQueryBuilder<T>,
    dto: PagePaginationDto,
  ) {
    const { page, take } = dto;

    const skip = (page - 1) * take;

    qb.take(take);
    qb.skip(skip);
  }

  applyCursorPaginationParmasToQb<T>(
    qb: SelectQueryBuilder<T>,
    dto: CursorPaginationDto,
  ) {
    const { id, order, take } = dto;

    if (id) {
      const direction = order === 'ASC' ? '>' : '<';

      qb.where(`${qb.alias}.id ${direction} :id`, { id });
    }

    qb.orderBy(`${qb.alias}.id`, order);

    qb.take(take);
  }
}
