export const FindByCurrentUserDocs = {
  apiOperation: { summary: 'Get files of the current user' },
  apiResponseStatus200: {
    status: 200,
    description: 'List of files retrieved successfully.',
  },
  apiResponseStatus401: {
    status: 401,
    description: 'Unauthorized access.',
  },
};
