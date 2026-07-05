import { QueryWithHelpers } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: QueryWithHelpers<any, any>;
  public query: Record<string, unknown>;
  private mongoFilter: Record<string, unknown> = {};

  constructor(
    modelQuery: QueryWithHelpers<any, any>,
    query: Record<string, unknown>,
  ) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    const searchTerm = this.query.search as string;

    if (searchTerm) {
      this.mongoFilter.$or = searchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      }));
    }

    return this;
  }

  filter() {
    const queryObj = { ...this.query };

    const excludedFields = ['search', 'sort', 'page', 'limit'];

    excludedFields.forEach((field) => delete queryObj[field]);

    this.mongoFilter = {
      ...this.mongoFilter,
      ...queryObj,
    };

    return this;
  }

  sort() {
    const sort =
      (this.query.sort as string)?.split(',').join(' ') || '-createdAt';

    this.modelQuery = this.modelQuery.sort(sort);

    return this;
  }

  paginate() {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  fields() {
    const fields = (this.query.fields as string)?.split(',').join(' ') || '';

    if (fields) {
      this.modelQuery = this.modelQuery.select(fields);
    }

    return this;
  }

  build() {
    this.modelQuery = this.modelQuery.find(this.mongoFilter);

    return this;
  }

  async countTotal() {
    const total = await this.modelQuery.model.countDocuments(this.mongoFilter);

    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}

export default QueryBuilder;
