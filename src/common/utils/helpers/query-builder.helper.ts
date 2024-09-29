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

export const whereClausesFromFilters = <T = any, Q = Record<string, any>>(
  query: Q,
  fields: IQueryBuilderWhereField<T>[],
): WhereOptions | null => {
  const whereConditions = [];

  fields.forEach(({ field, matchType }) => {
    const fieldValue = query[field as string];

    if (matchType === 'exact' && fieldValue !== undefined) {
      whereConditions.push({
        [field as string]: { [Op.eq]: fieldValue },
      });
    } else if (matchType === 'fuzzy' && fieldValue !== undefined) {
      whereConditions.push({
        [field as string]: { [Op.iLike]: `%${String(fieldValue)}%` },
      });
    } else if (matchType === 'multiple' && Array.isArray(fieldValue)) {
      whereConditions.push({
        [field as string]: { [Op.in]: fieldValue },
      });
    } else if (
      matchType === 'date' &&
      fieldValue !== undefined &&
      dayjs(fieldValue).isValid()
    ) {
      whereConditions.push({
        [field as string]: {
          [Op.gte]: dayjs(fieldValue).format('YYYY-MM-DD'),
          [Op.lt]: dayjs(fieldValue).add(1, 'days').format('YYYY-MM-DD'),
        },
      });
    } else if (
      matchType === 'daterange' &&
      Array.isArray(fieldValue) &&
      fieldValue.filter((d) => dayjs(d).isValid()).length === 2
    ) {
      whereConditions.push({
        [field as string]: {
          [Op.gte]: dayjs(fieldValue[0]).format('YYYY-MM-DD'),
          [Op.lt]: dayjs(fieldValue[1]).add(1, 'days').format('YYYY-MM-DD'),
        },
      });
    }
  });

  return whereConditions.length ? { [Op.and]: whereConditions } : null;
};

export const whereClausesFromSearch = <T>(
  searchTerm: string,
  searchFields: Array<keyof T>,
): WhereOptions | null => {
  if (!searchTerm) {
    return null;
  }

  const whereCondition = [];

  searchFields.forEach((field) => {
    whereCondition.push({
      [field as string]: { [Op.like]: `%${searchTerm}%` },
    });
  });

  return whereCondition.length ? { [Op.or]: whereCondition } : null;
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

export const joinWhereClauses = (
  joinBy: 'or' | 'and',
  clauses: WhereOptions[],
): WhereOptions => {
  const filteredClauses = clauses.filter((c) => c !== null);

  if (filteredClauses.length === 1) {
    return filteredClauses[0];
  }

  return {
    [Op[joinBy]]: filteredClauses,
  };
};
