export const parsePagination = (query) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  
  return { page, limit, skip };
};

export const buildPaginationMeta = (page, limit, totalDocs) => {
  const totalPages = Math.ceil(totalDocs / limit);
  
  return {
    page,
    limit,
    totalDocs,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};
