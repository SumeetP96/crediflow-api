import dayjs from 'dayjs';
import snakeCase from 'lodash.snakecase';
import sequelize, { Op, Order, WhereOptions } from 'sequelize';

export type TQueryBuilderWhereFieldMatchType =
  | 'exact'
  | 'fuzzy'
  | 'fuzzy-from-array'
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

    switch (matchType) {
      case 'exact':
        if (fieldValue !== undefined) {
          whereConditions.push({
            [field as string]: { [Op.eq]: fieldValue },
          });
        }
        break;

      case 'fuzzy':
        if (fieldValue !== undefined) {
          whereConditions.push({
            [field as string]: { [Op.iLike]: `%${String(fieldValue)}%` },
          });
        }
        break;

      case 'fuzzy-from-array':
        if (fieldValue !== undefined) {
          whereConditions.push(
            sequelize.where(
              sequelize.fn(
                'array_to_string',
                sequelize.col('contact_numbers'),
                ',',
              ),
              { [Op.iLike]: `%${String(fieldValue)}%` },
            ),
          );
        }
        break;

      case 'multiple':
        if (Array.isArray(fieldValue)) {
          whereConditions.push({
            [field as string]: { [Op.in]: fieldValue },
          });
        }
        break;

      case 'date':
        if (fieldValue !== undefined && dayjs(fieldValue).isValid()) {
          whereConditions.push({
            [field as string]: {
              [Op.gte]: dayjs(fieldValue).format('YYYY-MM-DD'),
              [Op.lt]: dayjs(fieldValue).add(1, 'days').format('YYYY-MM-DD'),
            },
          });
        }
        break;

      case 'daterange':
        if (
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
        break;
    }
  });

  return whereConditions.length ? { [Op.and]: whereConditions } : null;
};

export const whereClausesFromSearch = <T>(
  searchTerm: string,
  searchFields: IQueryBuilderWhereField<T>[],
): WhereOptions | null => {
  if (!searchTerm) {
    return null;
  }

  const whereConditions = [];

  searchFields.forEach(({ field, matchType }) => {
    switch (matchType) {
      case 'fuzzy':
        whereConditions.push({
          [field as string]: { [Op.iLike]: `%${searchTerm}%` },
        });
        break;

      case 'fuzzy-from-array':
        whereConditions.push(
          sequelize.where(
            sequelize.fn(
              'array_to_string',
              sequelize.col(snakeCase(field as string)),
              ',',
            ),
            { [Op.iLike]: `%${String(searchTerm)}%` },
          ),
        );
        break;
    }
  });

  return whereConditions.length ? { [Op.or]: whereConditions } : null;
};

export type TOrderByField<T = Record<string, any>> = [
  keyof T,
  'asc' | 'desc' | 'none',
];

export const orderByField = <T>(
  defaultOrderBy: TOrderByField<T>,
  orderBy?: TOrderByField<T>,
): Order => {
  let order = [defaultOrderBy];

  if (orderBy.filter(Boolean).length === 2 && orderBy[1] !== 'none') {
    order = [orderBy];
  }

  return order as Order;
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

export const pagination = (page: number, perPage: number): number[] => {
  const offset = (page - 1) * perPage;
  return [offset, perPage];
};
