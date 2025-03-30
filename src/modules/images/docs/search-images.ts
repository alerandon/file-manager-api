export const SearchImagesDocs = {
  apiOperation: { summary: 'Search images' },
  apiQuery: {
    name: 'query',
    description: 'Search query for images',
    required: false,
  },
  apiResponseStatus200: {
    status: 200,
    description: 'Images retrieved successfully.',
  },
  apiResponseStatus401: {
    status: 401,
    description: 'Unauthorized access.',
  },
};
