export const buildQuery = (query, searchFields = []) => {
  const filter = {};
  
  // Basic filtering
  if (query.category) filter.category = query.category;
  if (query.published !== undefined) filter.published = query.published === 'true' || query.published === true;
  if (query.featured !== undefined) filter.featured = query.featured === 'true' || query.featured === true;

  // Search logic
  if (query.search && searchFields.length > 0) {
    filter.$or = searchFields.map((field) => ({
      [field]: { $regex: query.search, $options: "i" },
    }));
  }

  // Sort logic
  let sort = { createdAt: -1 };
  if (query.sort) {
    const sortField = query.sort.startsWith('-') ? query.sort.substring(1) : query.sort;
    const sortOrder = query.sort.startsWith('-') ? -1 : 1;
    sort = { [sortField]: sortOrder };
  } else if (query.type === 'reel' || query.sortByOrder) {
    sort = { order: 1, createdAt: -1 };
  }

  return { filter, sort };
};
