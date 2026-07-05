import { Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  // Search
  search(searchableFields: string[]) {
    const search = this.query.search as string;

    if (search) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map((field) => ({
          [field]: {
            $regex: search,
            $options: 'i',
          },
        })),
      });
    }

    return this;
  }

  // Filter
  filter() {
    const queryObj = { ...this.query };

    const excludedFields = ['search', 'sort', 'page', 'limit', 'fields'];

    excludedFields.forEach((field) => delete queryObj[field]);

    this.modelQuery = this.modelQuery.find(queryObj);

    return this;
  }

  // Sort
  sort() {
    const sort =
      (this.query.sort as string)?.split(',').join(' ') || '-createdAt';

    this.modelQuery = this.modelQuery.sort(sort);

    return this;
  }

  // Pagination
  paginate() {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  // Field Selection
  fields() {
    const fields =
      (this.query.fields as string)?.split(',').join(' ') || '-__v';

    this.modelQuery = this.modelQuery.select(fields);

    return this;
  }

  // Pagination Metadata
  async countTotal() {
    const filter = this.modelQuery.getFilter();

    const total = await this.modelQuery.model.countDocuments(filter);

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
