export const CurrentUserDocs = {
  apiOperation: { summary: 'Get the current authenticated user' },
  apiResponseStatus200: {
    status: 200,
    description: 'Current user retrieved successfully.',
  },
  apiResponseStatus401: {
    status: 401,
    description: 'Unauthorized access.',
  },
};
