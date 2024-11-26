import snakeCase from 'lodash.snakecase';
import sequelize, { Op, Order, WhereOptions } from 'sequelize';
import { dayjs } from './date.helper';

export type TQueryBuilderWhereFieldMatchType =
  | 'exact'
  | 'fuzzy'
  | 'fuzzy-from-array'
  | 'fuzzy-from-number'
  | 'multiple'
  | 'date'
  | 'daterange'
  | 'yes-no-boolean';

export interface IQueryBuilderWhereField<T> {
  queryKey?: string;
  field: keyof T;
  matchType: TQueryBuilderWhereFieldMatchType;
  alias?: string;
}

export const whereClausesFromFilters = <T = any, Q = Record<string, any>>(
  defaultAlias: string,
  query: Q,
  fields: IQueryBuilderWhereField<T>[],
): WhereOptions | null => {
  const whereConditions = [];

  fields.forEach(({ queryKey, field, matchType, alias: tableAlias }) => {
    const fieldValue = query[queryKey ?? (field as string)];

    const alias = tableAlias ?? defaultAlias;

    let fieldName = `$${alias}.${snakeCase(field as string)}$`;

    if (matchType === 'fuzzy-from-array' || matchType === 'fuzzy-from-number') {
      fieldName = `${alias}.${snakeCase(field as string)}`;
    }

    switch (matchType) {
      case 'exact':
        if (fieldValue !== undefined) {
          whereConditions.push({
            [fieldName]: { [Op.eq]: fieldValue },
          });
        }
        break;

      case 'fuzzy':
        if (fieldValue !== undefined) {
          whereConditions.push({
            [fieldName]: { [Op.iLike]: `%${String(fieldValue)}%` },
          });
        }
        break;

      case 'fuzzy-from-array':
        if (fieldValue !== undefined) {
          whereConditions.push(
            sequelize.where(
              sequelize.fn('array_to_string', sequelize.col(fieldName), ','),
              { [Op.iLike]: `%${String(fieldValue)}%` },
            ),
          );
        }
        break;

      case 'fuzzy-from-number':
        if (fieldValue !== undefined) {
          whereConditions.push(
            sequelize.where(
              sequelize.cast(sequelize.col(fieldName), 'text'), // Cast numeric to text
              { [Op.iLike]: `%${String(fieldValue)}%` },
            ),
          );
        }

      case 'multiple':
        if (Array.isArray(fieldValue)) {
          whereConditions.push({
            [fieldName]: { [Op.in]: fieldValue },
          });
        }
        break;

      case 'date':
        if (fieldValue !== undefined && dayjs(fieldValue).isValid()) {
          whereConditions.push({
            [fieldName]: {
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
            [fieldName]: {
              [Op.gte]: dayjs(fieldValue[0]).format('YYYY-MM-DD'),
              [Op.lt]: dayjs(fieldValue[1]).add(1, 'days').format('YYYY-MM-DD'),
            },
          });
        }
        break;

      case 'yes-no-boolean':
        if (fieldValue !== undefined) {
          whereConditions.push({
            [fieldName]: { [Op.eq]: fieldValue.toLowerCase() === 'yes' },
          });
        }
        break;
    }
  });

  return whereConditions.length ? { [Op.and]: whereConditions } : null;
};

export const whereClausesFromSearch = <T>(
  defaultAlias: string,
  searchTerm: string,
  searchFields: IQueryBuilderWhereField<T>[],
): WhereOptions | null => {
  if (!searchTerm) {
    return null;
  }

  const whereConditions = [];

  searchFields.forEach(({ field, matchType, alias: tableAlias }) => {
    const alias = tableAlias ?? defaultAlias;

    let fieldName = `$${alias}.${snakeCase(field as string)}$`;

    if (matchType === 'fuzzy-from-array' || matchType === 'fuzzy-from-number') {
      fieldName = `${alias}.${snakeCase(field as string)}`;
    }

    switch (matchType) {
      case 'fuzzy':
        whereConditions.push({
          [fieldName]: { [Op.iLike]: `%${searchTerm}%` },
        });
        break;

      case 'fuzzy-from-array':
        whereConditions.push(
          sequelize.where(
            sequelize.fn('array_to_string', sequelize.col(fieldName), ','),
            { [Op.iLike]: `%${String(searchTerm)}%` },
          ),
        );
        break;

      case 'fuzzy-from-number':
        whereConditions.push(
          sequelize.where(
            sequelize.cast(sequelize.col(fieldName), 'text'), // Cast numeric to text
            { [Op.iLike]: `%${String(searchTerm)}%` },
          ),
        );
        break;
    }
  });

  return whereConditions.length ? { [Op.or]: whereConditions } : null;
};

export type TOrderByField<T = Record<string, any>> = [
  ...(keyof T)[],
  'asc' | 'desc' | 'none',
];

export const orderByField = <T>(
  defaultOrderBy: TOrderByField<T>,
  orderBy?: TOrderByField<T>,
): Order => {
  let order = [defaultOrderBy];

  if (orderBy.filter(Boolean).length === 2 && orderBy[1] !== 'none') {
    const field = String(orderBy[0]).split('.');
    const direction = orderBy[1];
    order = [field.concat(direction as string) as TOrderByField<T>];
  }

  return order as unknown as Order;
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
