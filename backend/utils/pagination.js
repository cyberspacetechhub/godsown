const paginate = (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;
  
  return { page, limit, skip };
};

const buildFilter = (query) => {
  const filter = {};
  const excludeFields = ['page', 'limit', 'sort', 'fields', 'search'];
  
  Object.keys(query).forEach(key => {
    if (!excludeFields.includes(key)) {
      filter[key] = query[key];
    }
  });
  
  return filter;
};

const buildSort = (sortQuery) => {
  if (sortQuery) {
    return sortQuery.split(',').join(' ');
  }
  return '-createdAt';
};

const paginateResponse = (data, total, page, limit) => {
  return {
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1
    }
  };
};

module.exports = {
  paginate,
  buildFilter,
  buildSort,
  paginateResponse
};
