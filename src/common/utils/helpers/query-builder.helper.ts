import dayjs from 'dayjs';
import { Op, Order, WhereOptions } from 'sequelize';

export type TQueryBuilderWhereFieldMatchType =
  | 'exact'
  | 'fuzzy'
  | 'multiple'
  | 'date'
  | 'daterange';

export interface IQueryBuilderWhereField<T> {
  field: keyof T;
  matchType: TQueryBuilderWhereFieldMatchType;
}

export const whereClauseFromFields = <T = any, Q = Record<string, any>>(
  fields: IQueryBuilderWhereField<T>[],
  query: Q,
): WhereOptions => {
  console.log('🚀 ~ query:', query);
  const where: WhereOptions = {};

  fields.forEach(({ field, matchType }) => {
    const fieldValue = query[field as string];

    if (matchType === 'exact' && fieldValue !== undefined) {
      where[field as string] = { [Op.eq]: fieldValue };
    } else if (matchType === 'fuzzy' && fieldValue !== undefined) {
      where[field as string] = { [Op.iLike]: `%${String(fieldValue)}%` };
    } else if (matchType === 'multiple' && Array.isArray(fieldValue)) {
      where[field as string] = { [Op.in]: fieldValue };
    } else if (
      matchType === 'date' &&
      fieldValue !== undefined &&
      dayjs(fieldValue).isValid()
    ) {
      where[field as string] = {
        [Op.gte]: dayjs(fieldValue).format('YYYY-MM-DD'),
        [Op.lt]: dayjs(fieldValue).add(1, 'days').format('YYYY-MM-DD'),
      };
    } else if (
      matchType === 'daterange' &&
      Array.isArray(fieldValue) &&
      fieldValue.filter((d) => dayjs(d).isValid()).length === 2
    ) {
      where[field as string] = {
        [Op.gte]: dayjs(fieldValue[0]).format('YYYY-MM-DD'),
        [Op.lt]: dayjs(fieldValue[1]).add(1, 'days').format('YYYY-MM-DD'),
      };
    }
  });

  return { [Op.and]: where };
};

export const whereClauseFromSearchFields = <T>(
  searchFields: Array<keyof T>,
  searchTerm?: string,
): WhereOptions => {
  if (!searchTerm) {
    return {};
  }

  const where: WhereOptions = {};

  searchFields.forEach((field) => {
    where[field as string] = {
      [Op.iLike]: `%${searchTerm}%`,
    };
  });

  return { [Op.or]: where };
};

export type TOrderByField<T = Record<string, any>> = [
  keyof T,
  'asc' | 'desc' | 'none',
];

export const orderByField = <T>(
  defaultOrderBy: TOrderByField<T>,
  orderBy?: TOrderByField<T>,
): Order => {
  let order = defaultOrderBy;

  if (orderBy.filter(Boolean).length === 2 && orderBy[1] !== 'none') {
    order = orderBy;
  }

  return [order] as Order;
};
